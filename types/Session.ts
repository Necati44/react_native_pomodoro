import uuid from 'react-native-uuid';

import { db } from "@/firebase/firebaseConfig";

import { collection, addDoc, getDocs, Timestamp, query, where } from 'firebase/firestore';

export type Session = {
    uuid: string;
    date: Date;
    sessionCount: number;
    workDuration: number;
    userUUID: string | undefined;
};

export async function addSession(sessionData: Omit<Session, 'uuid'>): Promise<void> {
    try {
      const session: Session = {
        ...sessionData,
        uuid: uuid.v4() as string,
      };
      
      // Conversion de la date en timestamp pour Firestore
      await addDoc(collection(db, 'sessions'), {
        ...session,
        date: Timestamp.fromDate(session.date),
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la session :', error);
    }
  }
  
  export async function getSessions(userUUID: string): Promise<Session[]> {
    try {
      const sessionsRef = collection(db, 'sessions');
      const q = query(sessionsRef, where('userUUID', '==', userUUID));
      const querySnapshot = await getDocs(q);
      const sessions: Session[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uuid: data.uuid,
          date: data.date.toDate(),
          sessionCount: data.sessionCount,
          workDuration: data.workDuration,
          userUUID: data.userUUID,
        } as Session;
      });
      return sessions;
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions :', error);
      return [];
    }
  }