import EventList from "@/components/events/EventList";
import EventsSearch from "@/components/events/EventsSearch";
import { getAllEvents } from "@/helpers/api-util";
import { useRouter } from "next/router";

const EventsPage = (props) => {
    const { allEvents } = props;
    const router = useRouter();

    const findEventsHandler = (year, month) => {
        const fullPath = `/events/${year}/${month}`;
        router.push(fullPath);
    };

    return (
        <div>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={allEvents} />
        </div>
    );
};

export async function getStaticProps() {
    const allEvents = await getAllEvents();

    return {
        props: {
            allEvents: allEvents,
        },
        revalidate: 60,
    };
}

export default EventsPage;
