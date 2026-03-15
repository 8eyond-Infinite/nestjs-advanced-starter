import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../../domain/events/user-registered.event';

@EventsHandler(UserRegisteredEvent)
export class SendWelcomeEmailHandler implements IEventHandler<UserRegisteredEvent> {
  handle(event: UserRegisteredEvent) {
    const { email, userId, occurredAt } = event;
    console.log('---');
    console.log(`[EVENT CONSUMED] 🚀`);
    console.log(`User ID: ${userId}`);
    console.log(`Email: ${email}`);
    console.log(`Time: ${occurredAt.toISOString()}`);
    console.log(`Action: Sending welcome email to this new soul...`);
    console.log('---');
  }
}
