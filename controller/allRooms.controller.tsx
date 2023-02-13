import dayjs from 'dayjs';

import { BookableRoomEntity, rooms } from '../data/rooms.data';
import { ROOM_SCHEDULES_FETCH_TIME_DAYS } from '../data/time.data';
import { GetGoogleResourceSchedulesRequest } from '../googleClient/google.types';
import bookRoomsController from './booking.controller';

export default function allRoomsController() {
  const { checkRoomAvailability } = bookRoomsController();

  async function getBusyTimeOfRooms() {
    let numOk = 0;
    let numErrors = 0;

    const newRooms = await Promise.all(
      Object.entries(rooms).map(async ([key, room]) => {
        if (!(room.type === 'ROOM' && ['BOOKABLE'].includes(room.bookable))) {
          return [key, room] as const;
        }

        const newBody: GetGoogleResourceSchedulesRequest = {
          items: [
            {
              id: (room as BookableRoomEntity).email,
            },
          ],
          timeMin: dayjs().startOf('day').toDate(),
          timeMax: dayjs()
            .endOf('day')
            .add(ROOM_SCHEDULES_FETCH_TIME_DAYS, 'days')
            .toDate(),
        };
        const [error, busyTimes] = await checkRoomAvailability(newBody);

        if (error != null) {
          numErrors++;

          return [key, room] as const;
        }
        const newRoom = {
          ...room,
          busyTimes,
        };
        numOk++;

        return [key, newRoom] as const;
      })
    );
    const newRoomsObj = Object.fromEntries(newRooms);

    if (numOk === 0 && numErrors > 0) {
      console.error('failed to getBusyTimeOfRooms');

      return [new Error(), newRoomsObj];
    }
    return [null, newRoomsObj] as const;
  }
  return { getBusyTimeOfRooms };
}
