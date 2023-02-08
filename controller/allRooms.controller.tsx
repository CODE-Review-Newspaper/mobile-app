import dayjs from 'dayjs';

import { BookableRoomEntity, rooms } from '../data/rooms.data';
import { CheckBusyRoomRequest } from '../types/dings.types';
import bookRoomsController from './booking.controller';

export default function allRoomsController() {
  const { checkRoomAvailability } = bookRoomsController();

  async function getBusyTimeOfRooms() {
    const newRooms = Object.fromEntries(
      await Promise.all(
        Object.entries(rooms).map(async ([key, room]) => {
          if (
            !(
              room.type === 'ROOM' &&
              ['BOOKABLE', 'APPLICATION_REQUIRED'].includes(room.bookable)
            )
          )
            return [key, room] as const;

          const newBody: CheckBusyRoomRequest = {
            items: [
              {
                id: (room as BookableRoomEntity).email,
              },
            ],
            timeMin: dayjs().startOf('day').toDate(),
            timeMax: dayjs().endOf('day').add(7, 'days').toDate(),
          };
          const [error, busyTimes] = await checkRoomAvailability(newBody);

          if (error != null) {
            console.error('error inside getBusyTimeOfRooms:', error);

            return [key, room] as const;
          }
          const newRoom = {
            ...room,
            busyTimes,
          };
          return [key, newRoom] as const;
        })
      )
    );
    return [null, newRooms] as const;
  }
  return { getBusyTimeOfRooms };
}
