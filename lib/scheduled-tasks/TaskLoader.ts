import { Task } from "../core/model/Task"

export const scheduledTasks: Task[] = [
  new Task('Example Interval', 10000, () => {
    console.log('An example task with a 10 second loop')
  }),
  new Task('Example Timeout', 5000, () => {
    console.log('An example task with a 10 second timeout. I wont run anymore')
  }, false),
  new Task('Example Cron Schedule', '* * * * *', () => {
    console.log('An example task with a 1 minute cron job')
  }, false)
]