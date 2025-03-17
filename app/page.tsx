"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { fetchSpots, submitForm } from "./actions";
import { experienceLevels, tripOptions } from "@/constants/db";
import { useFormState } from "react-dom";

const BookSpotPage = () => {
  const [trips, setTrips] = useState(0);
  const [tripHasError, setTripHasError] = useState(false);

  useFormState;

  const tripGotError = useCallback((result: boolean) => {
    setTripHasError(result);
  }, []);

  return (
    <>
      <section className="space-y-6">
        <h2 className="text-3xl text-blue-800 font-bold">
          Choose Your Weekend Adventure
        </h2>
        <p>
          Select your preferred weekend dates for your bird watching trips. We
          offer trips on weekends (Saturday and Sunday) only, with weekday trips
          available upon special request for groups.
        </p>
      </section>

      <h2 className="text-3xl text-blue-800 font-bold">Trip Options</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
        {tripOptions.map((option) => (
          <div
            className="rounded-lg p-6 shadow-lg bg-white text-center space-y-4"
            key={option.heading}
          >
            <h4 className="text-lg font-semibold text-blue-500">
              {option.heading}
            </h4>
            <div>
              <span className="text-base font-semibold">Time: </span>
              {option.time}
            </div>
            <div>
              <span className="text-base font-semibold">Duration: </span>
              {option.duration}
            </div>
            <p>{option.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg p-8 shadow-lg bg-white space-y-4">
        <h2 className="text-3xl text-blue-800 font-bold">
          Express Your Interest
        </h2>
        <p>
          Fill out the form below to show your interest in participating. Trips
          require a minimum of 12 participants to be confirmed.
        </p>

        <form className="flex flex-col gap-3">
          <label htmlFor="name" className="text-blue-700 font-semibold">
            Name*
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="border rounded p-2"
          />
          <label htmlFor="email" className="text-blue-700 font-semibold">
            Email*
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="border rounded p-2"
          />
          <label htmlFor="phone" className="text-blue-700 font-semibold">
            Contact Number*
          </label>
          <input
            name="phone"
            id="phone"
            type="tel"
            maxLength={10}
            minLength={10}
            size={10}
            title="Please enter valid 10 digit phone number"
            required
            className="border rounded p-2"
          />
          <label htmlFor="exp" className="text-blue-700 font-semibold">
            Experience Level*
          </label>
          <select name="exp" id="exp" className="border rounded p-2">
            {experienceLevels.map((e, i) => (
              <option value={i} key={i}>
                {e}
              </option>
            ))}
          </select>

          <h4 className="text-lg font-bold mt-6">Trip Selections</h4>

          {[...Array(trips)].map((trip, i) => (
            <AddTrip key={i} onError={tripGotError} />
          ))}

          <div className="flex gap-3 mt-6">
            <button
              className="bg-blue-600 px-4 py-2 text-white rounded"
              type="button"
              onClick={() => {
                setTrips((prev) => prev + 1);
              }}
            >
              + Add Trip
            </button>
            <button
              className="bg-red-500 disabled:bg-slate-500 disabled:line-through text-white px-2 py-1 rounded"
              type="button"
              onClick={() => {
                setTrips((prev) => prev - 1);
              }}
              disabled={trips === 0}
            >
              - Remove Trip
            </button>
            <button
              type="submit"
              className="bg-green-600 px-4 py-2 disabled:bg-slate-500 disabled:line-through text-white rounded ml-auto"
              formAction={(f) => {
                submitForm(f);
                alert(
                  "Thank you for showing interest! We will contact you once the trip is confirmed."
                );
                setTrips(0);
              }}
              disabled={tripHasError || trips === 0}
            >
              Submit
            </button>
          </div>
        </form>
      </section>

      <div className="py-6 text-center">
        <h4 className="text-lg font-bold">Special Requests</h4>
        <p>
          For special requests, such as weekday trips for groups, please contact
          us at <span className="font-bold">info@pelagicbirdwatching.com</span>
        </p>
      </div>
    </>
  );
};

const AddTrip = memo(({ onError }: { onError: (result: boolean) => void }) => {
  const [tripType, setTripType] = useState(0);
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [spot, setSpot] = useState<number | null>(null);

  useEffect(() => {
    const day = date.getDay();
    setSpot(null);

    if ((tripType === 0 || tripType === 1) && day !== 0 && day !== 6) {
      setError("Trips are allowed only on weekends");
    } else if (tripType === 2 && day !== 6) {
      setError("Overnight trips are allowed only on Saturdays");
    } else {
      setError(null);

      fetchSpots(tripType, date).then((spot) => {
        if (spot <= 0)
          setError("All spots are filled please select another date");
        else setSpot(spot);
      });
    }
  }, [tripType, date]);

  useEffect(() => {
    onError(!!error);
  }, [error]);

  return (
    <section className="rounded-lg px-4 pt-4 pb-6 shadow-md shadow-slate-300 bg-white space-y-4 border-2">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-col flex-1">
          <label htmlFor="trip" className="text-blue-700 font-semibold">
            Trip Type*
          </label>
          <select
            name="trip"
            id="trip"
            className="border rounded p-2"
            value={tripType.toString()}
            onChange={(e) => {
              setTripType(Number(e.target.value));
            }}
          >
            {tripOptions.map((trip, index) => (
              <option
                value={index}
                key={index}
              >{`${trip.heading} (${trip.time})`}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="date" className="text-blue-700 font-semibold">
            Date*
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            className="border rounded p-2"
            value={date.toISOString().substring(0, 10)}
            onChange={(e) => {
              setDate(new Date(e.target.value));
            }}
          />
        </div>
      </div>

      {error && (
        <p className="bg-red-200 p-2">
          <span className="font-bold">Error: </span>
          {error}
        </p>
      )}

      {spot && (
        <p
          className={`${spot > 7 ? "bg-green-200" : spot > 4 ? "bg-amber-200" : "bg-orange-200"} p-2`}
        >
          <span className="font-bold">Spots Left: </span>
          {spot} / 10
        </p>
      )}
    </section>
  );
});

export default BookSpotPage;