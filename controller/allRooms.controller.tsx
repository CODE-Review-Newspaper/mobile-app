import dayjs from 'dayjs';

import { RoomBookableData, RoomCategoryData, rooms } from '../data/rooms.data';
import { BusyRooms, CheckBusyRoomRequest } from '../types/dings.types';
import bookRoomsController from './booking.controller';

export interface Room {
  id: string | null;
  displayName: string;
  factoryRoomNumber: string | null;
  bookable: keyof typeof RoomBookableData;
  category: keyof typeof RoomCategoryData;
  busyTimes?: BusyRooms[];
}
export default function allRoomsController() {
  const { checkRoomAvailability } = bookRoomsController();

  async function getBusyTimeOfRooms() {
    const newRooms = Object.fromEntries(
      await Promise.all(
        Object.entries(rooms).map(async ([key, room]) => {
          if (!(room.bookable === 'BOOKABLE' && room.id != null))
            return [key, room] as const;

          const newBody: CheckBusyRoomRequest = {
            items: [
              {
                id: room.id,
              },
            ],
            timeMin: dayjs().startOf('day').toDate(),
            timeMax: dayjs().endOf('day').add(7, 'days').toDate(),
          };
          const [error, busyTimes] = await checkRoomAvailability(newBody);

          if (error != null) {
            console.error('error inside checkRoomAvailability:', error);

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
