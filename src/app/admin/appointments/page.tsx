import { AppointmentCard } from "@/components/admin/appointment-card";
import { getAppointments } from "@/lib/queries";

/*
 * The diary, grouped by day.
 *
 * Every time on this page is rendered in Africa/Lagos rather than in the
 * server's zone or the viewer's. The atelier's hours are the atelier's hours,
 * and a booking that reads 10:00 to the person keeping it must read 10:00 to
 * everyone looking at the diary, wherever they happen to be.
 */

export const metadata = { title: "Appointments" };

const LAGOS = "Africa/Lagos";

/** The Lagos calendar day an instant falls on — the key everything groups by. */
function lagosDay(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LAGOS,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function heading(day: string) {
  const date = new Date(`${day}T12:00:00Z`);
  const today = lagosDay(new Date().toISOString());

  const label = date.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

  return day === today ? `Today · ${label}` : label;
}

export default async function AdminAppointments() {
  const appointments = await getAppointments();
  const pending = appointments.filter(
    (appointment) => appointment.status === "requested",
  ).length;

  const days = new Map<string, typeof appointments>();

  for (const appointment of appointments) {
    const day = lagosDay(appointment.starts_at);
    days.set(day, [...(days.get(day) ?? []), appointment]);
  }

  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <header>
        <h1 className="text-[clamp(1.4rem,5vw,2.2rem)]">Appointments</h1>
        <p className="text-muted mt-2 text-sm">
          {appointments.length} in the diary
          {pending > 0 && ` · ${pending} awaiting confirmation`} · all times
          Lagos
        </p>
      </header>

      {appointments.length === 0 ? (
        <p className="border-line text-muted mt-10 rounded-lg border border-dashed px-6 py-20 text-center text-sm">
          Nothing booked. Requests arrive here from the storefront and wait for
          you to confirm them.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {[...days.entries()].map(([day, entries]) => (
            <section key={day}>
              <h2 className="text-gold border-line border-b pb-3 text-[0.6rem] tracking-[0.28em] uppercase">
                {heading(day)}
              </h2>

              <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {entries.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
