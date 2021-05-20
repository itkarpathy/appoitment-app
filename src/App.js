import { BiCalendar } from "react-icons/bi";
import AddAppointement from "./component/AddAppointement";
import AppointmentInfo from "./component/AppointmentInfo";
import Search from "./component/Search";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("ownerName");
  const [orderBy, setOrderBy] = useState("asc");

  const filteredAppointment = appointmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === "asc" ? 1 : 1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase
        ? -1 * order
        : 1 * order;
    });

  const fetchData = useCallback(() => {
    fetch("./data.json")
      .then((response) => response.json())
      .then((data) => {
        setAppointmentList(data);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-400 align-top" /> Your
        Appointements:
      </h1>
      <AddAppointement
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
      />
      <Search
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointment.map((appointment) => {
          return (
            <AppointmentInfo
              key={appointment.id}
              appointment={appointment}
              onDeleteAppointment={(appointmentId) =>
                setAppointmentList(
                  appointmentList.filter(
                    (appointment) => appointment.id !== appointmentId
                  )
                )
              }
            />
          );
        })}
      </ul>
    </div>
  );
}

export default App;
