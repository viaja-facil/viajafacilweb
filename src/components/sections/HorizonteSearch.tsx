"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { airports } from "@/lib/mock-data";
import { buildSearchParams } from "@/lib/search-params";
import { useBooking } from "@/lib/booking-context";
import { useHorizonteForm } from "@/components/layout/HorizonteShell";
import CustomSelect from "@/components/ui/CustomSelect";
import DateSelect from "@/components/ui/DateSelect";
import PassengerSelect from "@/components/ui/PassengerSelect";

function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
export default function HorizonteSearch() {
  const f = useHorizonteForm();
  const [cabin, setCabin] = useState("economy");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setPassengerCount } = useBooking();
  const today = new Date().toLocaleDateString("en-CA");
  const airportOptions = airports.map((a) => ({
    value: a.code,
    label: a.city,
    description: `${a.code} · ${a.name}`,
  }));
  const selectDeparture = (date: string) => {
    (f.tripType === "roundtrip" ? f.setDepartureDate : f.setDate)(date);
    if (f.returnDate && f.returnDate < date) f.setReturnDate(null);
    setError("");
  };
  const selectLegDate = (index: number, date: string) => {
    f.setLegs((prev) =>
      prev.map((leg, i) =>
        i === index
          ? { ...leg, date }
          : i > index && leg.date && leg.date < date
            ? { ...leg, date: null }
            : leg,
      ),
    );
    setError("");
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const departureDate = f.departureDate || "";
    const returnDate = f.returnDate || "";
    const date = f.date || "";
    const legs = f.legs;
    if (
      f.tripType === "multicity"
        ? !legs.every(
            (leg) =>
              leg.origin && leg.destination && leg.origin !== leg.destination,
          )
        : !f.hasRouteSelected
    ) {
      setError("Escolha origens e destinos diferentes para cada voo.");
      return;
    }
    if (
      f.tripType === "multicity"
        ? legs.some(
            (leg, index) =>
              !leg.date ||
              leg.date < today ||
              (index > 0 && leg.date < (legs[index - 1].date || today)),
          )
        : f.tripType === "roundtrip"
          ? !departureDate ||
            !returnDate ||
            departureDate < today ||
            returnDate < departureDate
          : !date || date < today
    ) {
      setError(
        "Escolha as datas da viagem. O regresso e os voos seguintes devem ocorrer após a partida ou no mesmo dia.",
      );
      return;
    }
    setError("");
    setPassengerCount(f.passengers);
    const params = new URLSearchParams(
      buildSearchParams({
        origin: f.origin,
        destination: f.destination,
        date: date || undefined,
        departureDate: departureDate || undefined,
        returnDate: returnDate || undefined,
        tripType: f.tripType,
        legs,
        passengers: f.passengers,
        adults: f.adults,
        children: f.children,
      }),
    );
    params.set("cabin", cabin);
    router.push(`/search?${params}`);
  };
  const location = (field: "origin" | "destination", legIndex?: number) => {
    const isOrigin = field === "origin";
    const value = legIndex === undefined ? f[field] : f.legs[legIndex][field];
    return (
      <div className="field field-control">
        <span>{isOrigin ? "De onde?" : "Para onde?"}</span>
        <CustomSelect
          value={value}
          options={airportOptions}
          placeholder={isOrigin ? "Escolher origem" : "Escolher destino"}
          ariaLabel={`${isOrigin ? "Origem" : "Destino"}${legIndex === undefined ? "" : ` do voo ${legIndex + 1}`}`}
          leadingIcon={<Icon name={isOrigin ? "plane" : "pin"} />}
          buttonClassName="home-control"
          onChange={(next) => {
            if (legIndex !== undefined) f.updateLeg(legIndex, field, next);
            else (isOrigin ? f.setOrigin : f.setDestination)(next);
            setError("");
          }}
        />
      </div>
    );
  };
  const passengers = (
    <div className="field travellers passenger-field">
      <span className="passenger-label">Passageiros</span>
      <PassengerSelect
        adults={f.adults}
        childrenCount={f.children}
        onChange={(next) => {
          f.setAdults(next.adults);
          f.setChildren(next.childrenCount);
        }}
      />
    </div>
  );
  return (
    <form
      id="pesquisa"
      className="search-card"
      aria-label="Pesquisa de voos"
      onSubmit={submit}
      noValidate
    >
      <div className="search-top">
        <fieldset className="trip-types">
          <legend className="sr-only">Tipo de viagem</legend>
          {(
            [
              { value: "roundtrip", label: "Ida e volta" },
              { value: "oneway", label: "Só ida" },
              { value: "multicity", label: "Multi-cidade" },
            ] as const
          ).map((t) => (
            <label key={t.value}>
              <input
                type="radio"
                name="trip"
                value={t.value}
                checked={f.tripType === t.value}
                onChange={() => {
                  f.setTripType(t.value);
                  setError("");
                }}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="cabin-select field-control">
          <CustomSelect
            ariaLabel="Classe de viagem"
            value={cabin}
            onChange={setCabin}
            buttonClassName="home-control"
            options={[
              { value: "economy", label: "Económica" },
              { value: "business", label: "Executiva" },
              { value: "first", label: "Primeira classe" },
            ]}
          />
        </div>
      </div>
      {f.tripType === "multicity" ? (
        <>
          {f.legs.map((leg, index) => (
            <div className="multi-leg" key={leg.id}>
              <span className="leg-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {location("origin", index)}
              {location("destination", index)}
              <div className="field date-field field-control">
                <span>Partida</span>
                <DateSelect
                  ariaLabel={`Data do voo ${index + 1}`}
                  value={leg.date}
                  min={index > 0 ? f.legs[index - 1].date || today : today}
                  onChange={(date) => selectLegDate(index, date)}
                />
              </div>
              {f.legs.length > 2 && (
                <button
                  className="destination-choose"
                  type="button"
                  onClick={() => f.removeLeg(index)}
                  aria-label={`Remover voo ${index + 1}`}
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          {f.legs.length < 6 && (
            <button className="text-link" type="button" onClick={f.addLeg}>
              Adicionar voo
            </button>
          )}
          <div className="search-fields oneway" style={{ marginTop: 16 }}>
            {passengers}
            <button className="button search-button" type="submit">
              <Icon name="search" />
              Pesquisar voos
            </button>
          </div>
        </>
      ) : (
        <div
          className={`search-fields ${f.tripType === "oneway" ? "oneway" : ""}`}
        >
          <div className="location-group">
            {location("origin")}
            <button
              className="swap"
              type="button"
              aria-label="Trocar origem e destino"
              onClick={() => {
                f.setOrigin(f.destination);
                f.setDestination(f.origin);
              }}
            >
              <Icon name="swap" />
            </button>
            {location("destination")}
          </div>
          <div className="field date-field field-control">
            <span>Partida</span>
            <DateSelect
              ariaLabel="Data de partida"
              value={f.tripType === "roundtrip" ? f.departureDate : f.date}
              min={today}
              onChange={selectDeparture}
            />
          </div>
          {f.tripType === "roundtrip" && (
            <div className="field date-field field-control">
              <span>Regresso</span>
              <DateSelect
                ariaLabel="Data de regresso"
                value={f.returnDate}
                min={f.departureDate || today}
                onChange={(date) => {
                  f.setReturnDate(date);
                  setError("");
                }}
              />
            </div>
          )}
          {passengers}
          <button className="button search-button" type="submit">
            <Icon name="search" />
            Pesquisar voos
          </button>
        </div>
      )}
      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}
      <div className="search-bottom">
        <span>
          <Icon name="check" />
          Uma viagem à sua medida
        </span>
        <span>Já sabe para onde vai? Comece por aqui.</span>
      </div>
    </form>
  );
}
