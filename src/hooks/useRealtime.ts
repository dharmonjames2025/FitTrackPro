import { useEffect, useRef, useCallback } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useRealtime = <T>(
  collectionName: string,
  queries: { field: string; operator: any; value: any }[] = [],
  orderByField?: string,
  limitCount?: number,
) => {
  const dataRef = useRef<T[]>([]);
  const listenersRef = useRef<(() => void)[]>([]);

  const subscribe = useCallback((callback: (data: T[]) => void) => {
    const constraints: any[] = [];
    
    queries.forEach(q => {
      constraints.push(where(q.field, q.operator, q.value));
    });
    
    if (orderByField) {
      constraints.push(orderBy(orderByField, 'desc'));
    }
    
    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      dataRef.current = data;
      callback(data);
    }, (error) => {
      console.error(`Error in realtime subscription to ${collectionName}:`, error);
      callback([]);
    });

    listenersRef.current.push(unsubscribe);

    return () => {
      unsubscribe();
      listenersRef.current = listenersRef.current.filter(l => l !== unsubscribe);
    };
  }, [collectionName, queries, orderByField, limitCount]);

  useEffect(() => {
    return () => {
      listenersRef.current.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return { subscribe, getData: () => dataRef.current };
};