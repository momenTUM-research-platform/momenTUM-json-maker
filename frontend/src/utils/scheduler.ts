
 /**
   * Schedules Modules based on their alerts
   *
   */
  export function schedule(modules: Module[], properties: Properties) : Event[] {
    // allocate the participant to a study condition

    const conditions = properties.conditions;

let events : Event[] = []

    // loop through all of the modules in this study
    // and create the associated study tasks based
    // on the alert schedule
modules.forEach(module =>    {
    
        const startDay = new Date(); // set a date object for today
        startDay.setHours(0, 0, 0, 0); // set the time to midnight

        // add offset days to get first day of alerts
        startDay.setDate(startDay.getDate() + module.alerts.start_offset);

        for (let days = 0; days < module.alerts.duration; days++) {
          // for each alert time, get the hour and minutes and if necessary randomise it
          module.alerts.times.forEach((alert) => {
            const taskTime = new Date(startDay.getTime());
            taskTime.setHours(alert.hours);
            taskTime.setMinutes(alert.minutes);

            if (module.alerts.random) {
              // remove the randomInterval from the time
              taskTime.setMinutes(
                taskTime.getMinutes() - module.alerts.random_interval
              );

              // calc a random number between 0 and (randomInterval * 2)
              // to account for randomInterval either side
              const randomMinutes = Math.random() * (module.alerts.random_interval * 2);

              // add the random number of minutes to the dateTime
              taskTime.setMinutes(taskTime.getMinutes() + randomMinutes);
            }

            // create a task object
            const options = {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            } as const;
            
            conditions.forEach(condition => {
                const event: Event = {
                    module: module.id
                    timestamp: taskTime.getTime()
                    condition,
                }
    
                events.push(event);

            })
          });

          // as a final step increment the date by 1 to set for next day
          startDay.setDate(startDay.getDate() + 1);
        }
      }
     
)
    events.sort((a: Event, b: Event) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);

      return dateA.getTime() - dateB.getTime();
    });

    return events;
  }
