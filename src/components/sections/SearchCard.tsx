"use client";

import { useEffect, useId, useRef } from "react";
import type { useSearchForm } from "@/hooks/useSearchForm";
import { airports } from "@/lib/mock-data";
import { todayInAngola } from "@/lib/search-validation";
import CustomSelect from "@/components/ui/CustomSelect";
import PassengerSelect from "@/components/ui/PassengerSelect";
import { Search, Plus, X } from "lucide-react";

type SearchCardProps = ReturnType<typeof useSearchForm>;
const airportOptions = [{ value: "", label: "Selecionar aeroporto" }, ...airports.map((a) => ({ value: a.code, label: `${a.city} (${a.code})` }))];

export default function SearchCard(form: SearchCardProps) {
  const id = useId();
  const errorRef = useRef<HTMLParagraphElement>(null);
  const today = todayInAngola();
  useEffect(() => { if (form.searchError) errorRef.current?.focus(); }, [form.searchError]);
  const fieldClass = "min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 disabled:bg-slate-100";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const routeChange = (field: "origin" | "destination", value: string) => {
    if (field === "origin") form.setOrigin(value); else form.setDestination(value);
    form.setDate(null); form.setDepartureDate(null); form.setReturnDate(null);
  };
  return (
    <form onSubmit={form.handleSearch} aria-label="Pesquisar voos" className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-lg sm:p-6">
      <fieldset className="mb-5"><legend className="sr-only">Tipo de viagem</legend>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          {([{ value: "oneway", label: "Só ida" }, { value: "roundtrip", label: "Ida e volta" }, { value: "multicity", label: "Multi-cidade" }] as const).map((type) => (
            <label key={type.value} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-xs font-semibold sm:px-3 sm:text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${form.tripType === type.value ? "border-[var(--action)] bg-orange-50 text-[var(--action)]" : "border-slate-200 text-slate-600"}`}>
              <input type="radio" name="tripType" value={type.value} checked={form.tripType === type.value} onChange={() => form.setTripType(type.value)} className="sr-only" />{type.label}
            </label>
          ))}
        </div>
      </fieldset>
      {form.tripType === "multicity" ? (
        <div className="space-y-4">
          {form.legs.map((leg, index) => (
            <fieldset key={leg.id} className="rounded-xl border border-slate-200 p-3">
              <legend className="px-1 text-sm font-bold">Trecho {index + 1}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><p className={labelClass}>Origem</p><CustomSelect value={leg.origin} options={airportOptions} ariaLabel={`Origem do trecho ${index + 1}`} onChange={(v) => form.updateLeg(index, "origin", v)} /></div>
                <div><p className={labelClass}>Destino</p><CustomSelect value={leg.destination} options={airportOptions} ariaLabel={`Destino do trecho ${index + 1}`} onChange={(v) => form.updateLeg(index, "destination", v)} /></div>
                <div><label htmlFor={`${id}-leg-${index}`} className={labelClass}>Data</label><input id={`${id}-leg-${index}`} type="date" min={index > 0 ? form.legs[index - 1].date || today : today} value={leg.date || ""} onChange={(e) => form.handleLegDateSelect(index, e.target.value)} className={fieldClass} /></div>
              </div>
              {form.legs.length > 2 && <button type="button" onClick={() => form.removeLeg(index)} className="mt-2 flex min-h-11 items-center gap-2 text-sm text-red-700"><X aria-hidden="true" className="h-4 w-4" />Remover trecho {index + 1}</button>}
            </fieldset>
          ))}
          <button type="button" disabled={form.legs.length >= 6} onClick={form.addLeg} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--action)] disabled:text-slate-500"><Plus aria-hidden="true" className="h-4 w-4" />Adicionar trecho</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-1"><p className={labelClass}>De onde?</p><CustomSelect value={form.origin} options={airportOptions} ariaLabel="Aeroporto de origem" onChange={(v) => routeChange("origin", v)} /></div>
          <div className="col-span-2 sm:col-span-1"><p className={labelClass}>Para onde?</p><CustomSelect value={form.destination} options={airportOptions} ariaLabel="Aeroporto de destino" onChange={(v) => routeChange("destination", v)} /></div>
          <div><label htmlFor={`${id}-departure`} className={labelClass}>{form.tripType === "roundtrip" ? "Ida" : "Data da viagem"}</label><input id={`${id}-departure`} type="date" min={today} disabled={form.tripType === "oneway" && form.flexible} value={(form.tripType === "roundtrip" ? form.departureDate : form.date) || ""} onChange={(e) => form.tripType === "roundtrip" ? form.setDepartureDate(e.target.value || null) : form.setDate(e.target.value || null)} className={fieldClass} /></div>
          {form.tripType === "roundtrip" ? <div><label htmlFor={`${id}-return`} className={labelClass}>Regresso</label><input id={`${id}-return`} type="date" min={form.departureDate || today} value={form.returnDate || ""} onChange={(e) => form.setReturnDate(e.target.value || null)} className={fieldClass} /></div> : <div><p className={labelClass}>Passageiros</p><PassengerSelect adults={form.adults} childrenCount={form.children} onChange={(v) => { form.setAdults(v.adults); form.setChildren(v.childrenCount); }} /></div>}
        </div>
      )}
      {form.tripType === "oneway" && <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.flexible} onChange={(e) => form.setFlexible(e.target.checked)} className="h-4 w-4 accent-[var(--action)]" />Datas flexíveis — explorar os próximos 60 dias</label>}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {form.tripType !== "oneway" && <div className="sm:w-64"><p className={labelClass}>Passageiros</p><PassengerSelect adults={form.adults} childrenCount={form.children} onChange={(v) => { form.setAdults(v.adults); form.setChildren(v.childrenCount); }} /></div>}
        <p className="text-xs leading-relaxed text-slate-600">Preços por passageiro. Voos e reservas de demonstração.</p>
        <button type="submit" className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--action)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--action-hover)]"><Search aria-hidden="true" className="h-5 w-5" />Pesquisar voos</button>
      </div>
      {form.searchError && <p ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-800">{form.searchError}</p>}
    </form>
  );
}
