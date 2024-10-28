import uuid from 'react-native-uuid';

import { db } from "@/firebase/firebaseConfig";

import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

export type Session = {
    uuid: string;
    date: Date;
    sessionCount: number;
    workDuration: number;
    userUUID: string | undefined;
};

// Ajouter une session dans Firestore
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
  
  // Récupérer toutes les sessions de Firestore
  export async function getSessions(): Promise<Session[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'sessions'));
      const sessions: Session[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
  
        // Conversion de Timestamp en Date pour correspondre au type Session
        return {
          uuid: data.uuid,
          date: data.date.toDate(), // Conversion Timestamp Firestore en Date
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