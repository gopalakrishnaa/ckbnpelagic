import React from "react";
import { fetchBookings } from "../actions";
import { experienceLevels, tripOptions } from "@/constants/db";

export type Booking = {
  type: number;
  date: string;
  user: User;
};

type User = {
  name: string;
  email: string;
  contact: number;
  experience: number;
};

const Admin = async () => {
  const bookings = await fetchBookings();

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <Head />
              <tbody>
                {bookings?.map((b, i) => <Row booking={b} key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const Head = () => (
  <thead>
    <tr>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Trip type
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Date
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Name
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Email
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Contact
      </th>
      <th
        scope="col"
        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
      >
        Experience
      </th>
    </tr>
  </thead>
);

const Row = ({ booking }: { booking: Booking }) => {
  console.log({ booking });
  return (
    <tr className="odd:bg-white even:bg-gray-100">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
        {tripOptions[booking.type].heading}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {booking.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {booking.user.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {booking.user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {booking.user.contact}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
        {experienceLevels[booking.user.experience]}
      </td>
    </tr>
  );
};

export default Admin;