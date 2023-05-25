import EventList from "@/components/events/EventList";
import ResultsTitle from "@/components/results-title/results-title";
import Button from "@/components/common/Button";
import ErrorAlert from "@/components/error-alert/error-alert";
import { getFilteredEvents } from "@/helpers/api-util";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";

const FilteredEventsPage = () => {
    const [loadedEvents, setLoadedEvents] = useState();
    const router = useRouter();

    const filterData = router.query.slug;

    const { data, error } = useSWR(
        "https://nextjs-course-4620e-default-rtdb.firebaseio.com/events.json",
        (url) => fetch(url).then((res) => res.json())
    );

    useEffect(() => {
        if (data) {
            const events = [];
            for (const key in data) {
                events.push({
                    id: key,
                    ...data[key],
                });
            }
            setLoadedEvents(events);
        }
    }, [data]);

    if (!loadedEvents) {
        return <p className="center">Loading...</p>;
    }

    const filteredYear = filterData[0];
    const filteredMonth = filterData[1];

    const numYear = +filteredYear;
    const numMonth = +filteredMonth;

    if (
        isNaN(numYear) ||
        isNaN(numMonth) ||
        numYear > 2030 ||
        numYear < 2021 ||
        numMonth < 1 ||
        numMonth > 12 ||
        error
    ) {
        return (
            <>
                <ErrorAlert>
                    <p>Invalid filter. Please adjust your values!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const filteredEvents = loadedEvents.filter((event) => {
        const eventDate = new Date(event.date);
        console.log(eventDate);
        console.log(numYear);
        return (
            eventDate.getFullYear() === numYear &&
            eventDate.getMonth() === numMonth - 1
        );
    });

    console.log("FE", filteredEvents);

    if (!filteredEvents || filteredEvents.length === 0) {
        return (
            <>
                <ErrorAlert>
                    <p>No events found for the chosen filter!</p>
                </ErrorAlert>
                <div className="center">
                    <Button link="/events">Show All Events</Button>
                </div>
            </>
        );
    }

    const date = new Date(numYear, numMonth - 1);

    return (
        <>
            <ResultsTitle date={date} />
            <EventList items={filteredEvents} />
        </>
    );
};

export default FilteredEventsPage;
