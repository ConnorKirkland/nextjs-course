import EventSummary from "@/components/event-detail/event-summary";
import EventLogistics from "@/components/event-detail/event-logistics";
import EventContent from "@/components/event-detail/event-content";
import { Fragment } from "react";
import ErrorAlert from "@/components/error-alert/error-alert";
import { getFeaturedEvents, getEventById } from "@/helpers/api-util";

const EventDetailsPage = (props) => {
    const event = props.selectedEvent;

    if (!event) {
        return <div className="center">Loading...</div>;
    }

    return (
        <Fragment>
            <EventSummary title={event.title} />
            <EventLogistics
                date={event.date}
                address={event.location}
                image={event.image}
                imageAlt={event.title}
            />
            <EventContent>
                <p>{event.description}</p>
            </EventContent>
        </Fragment>
    );
};

export async function getStaticProps(context) {
    const eventId = context.params.eventId;
    const selectedEvent = await getEventById(eventId);

    return {
        props: {
            selectedEvent: selectedEvent,
            revalidate: 30,
        },
    };
}

export async function getStaticPaths() {
    const events = await getFeaturedEvents();
    const paths = events.map((event) => ({ params: { eventId: event.id } }));

    return {
        paths: paths,
        fallback: "blocking",
    };
}

export default EventDetailsPage;
