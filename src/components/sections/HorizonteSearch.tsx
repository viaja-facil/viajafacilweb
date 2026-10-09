"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { airports } from "@/lib/mock-data";
import { buildSearchParams } from "@/lib/search-params";
import { useBooking } from "@/lib/booking-context";
import { useHorizonteForm } from "@/components/layout/HorizonteShell";
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
  const airportOptions = airports.map((a) => (
    <option key={a.code} value={a.code}>
      {a.city}
    </option>
  ));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const departureDate = String(values.get("departureDate") || "");
    const returnDate = String(values.get("returnDate") || "");
    const date = String(values.get("date") || "");
    const legs = f.legs.map((leg, index) => ({
      ...leg,
      date: String(values.get(`legDate-${index}`) || ""),
    }));
    const allLegsValid = legs.every(
      (leg) =>
        leg.origin &&
        leg.destination &&
        leg.origin !== leg.destination &&
        leg.date,
    );
    if (f.tripType === "multicity" ? !allLegsValid : !f.hasRouteSelected) {
      setError("Escolha origens e destinos diferentes para cada voo.");
      return;
    }
    if (
      f.tripType === "roundtrip" &&
      departureDate &&
      returnDate &&
      returnDate < departureDate
    ) {
      setError("A data de regresso deve ser igual ou posterior à partida.");
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
      <label className="field">
        <span>{isOrigin ? "De onde?" : "Para onde?"}</span>
        <div className="input-row">
          <Icon name={isOrigin ? "plane" : "pin"} />
          <select
            aria-label={`${isOrigin ? "Origem" : "Destino"}${legIndex === undefined ? "" : ` do voo ${legIndex + 1}`}`}
            required
            value={value}
            onChange={(e) => {
              if (legIndex !== undefined)
                f.updateLeg(legIndex, field, e.target.value);
              else (isOrigin ? f.setOrigin : f.setDestination)(e.target.value);
              setError("");
            }}
          >
            <option value="">
              {isOrigin ? "Escolher origem" : "Escolher destino"}
            </option>
            {airportOptions}
          </select>
        </div>
      </label>
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
        <label className="cabin-select">
          <span className="sr-only">Classe de viagem</span>
          <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
            <option value="economy">Económica</option>
            <option value="business">Executiva</option>
            <option value="first">Primeira classe</option>
          </select>
          <Icon name="chevron" />
        </label>
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
              <label className="field">
                <span>Partida</span>
                <input
                  type="date"
                  required
                  min={index > 0 ? f.legs[index - 1].date || today : today}
                  name={`legDate-${index}`}
                  aria-label={`Data do voo ${index + 1}`}
                  value={leg.date || ""}
                  onInput={(e) =>
                    f.handleLegDateSelect(index, e.currentTarget.value)
                  }
                />
              </label>
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
          <label className="field date-field">
            <span>Partida</span>
            <div className="input-row">
              <Icon name="calendar" />
              <input
                type="date"
                required
                min={today}
                name={f.tripType === "roundtrip" ? "departureDate" : "date"}
                aria-label="Data de partida"
                value={
                  (f.tripType === "roundtrip" ? f.departureDate : f.date) || ""
                }
                onInput={(e) =>
                  (f.tripType === "roundtrip" ? f.setDepartureDate : f.setDate)(
                    e.currentTarget.value,
                  )
                }
              />
            </div>
          </label>
          {f.tripType === "roundtrip" && (
            <label className="field date-field">
              <span>Regresso</span>
              <div className="input-row">
                <Icon name="calendar" />
                <input
                  type="date"
                  required
                  min={f.departureDate || today}
                  name="returnDate"
                  aria-label="Data de regresso"
                  value={f.returnDate || ""}
                  onInput={(e) => f.setReturnDate(e.currentTarget.value)}
                />
              </div>
            </label>
          )}
          {passengers}
          <button className="button search-button" type="submit">
            <Icon name="search" />
            Pesquisar voos
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
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
