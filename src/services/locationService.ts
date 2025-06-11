import { getFirebaseInstance } from '@/config/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  CollectionReference,
  Query
} from 'firebase/firestore';

// Defining the Location type here since it's not in @/types
interface Location {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  created?: Date;
  updated?: Date;
}

class LocationService {
  private get db() {
    return getFirebaseInstance().db;
  }
  private locationsCollection = 'locations';

  /**
   * Cria uma nova localização
   */
  async createLocation(location: Omit<Location, 'id'>): Promise<string> {
    try {
      const locationRef = await addDoc(
        collection(this.db, this.locationsCollection),
        {
          ...location,
          created: serverTimestamp(),
          updated: serverTimestamp(),
        }
      );

      return locationRef.id;
    } catch (error) {
      console.error('Erro ao criar localização:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma localização existente
   */
  async updateLocation(id: string, location: Partial<Location>): Promise<void> {
    try {
      const locationRef = doc(this.db, this.locationsCollection, id);
      await updateDoc(locationRef, {
        ...location,
        updated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      throw error;
    }
  }

  /**
   * Busca uma localização pelo ID
   */
  async getLocation(id: string): Promise<Location | null> {
    try {
      const locationRef = doc(this.db, this.locationsCollection, id);
      const locationDoc = await getDoc(locationRef);
      
      if (!locationDoc.exists()) {
        return null;
      }
      
      return { id: locationDoc.id, ...locationDoc.data() } as Location;
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      throw error;
    }
  }

  /**
   * Lista localizações com filtros
   */
  async getLocations(filters?: { city?: string; state?: string }): Promise<Location[]> {
    try {
      const constraints: any[] = [];
      if (filters?.city) {
        constraints.push(where('city', '==', filters.city));
      }
      if (filters?.state) {
        constraints.push(where('state', '==', filters.state));
      }

      // Create query with collection reference
      const baseQuery = collection(this.db, this.locationsCollection);
      const finalQuery = constraints.length > 0
        ? query(baseQuery, ...constraints, orderBy('created', 'desc'))
        : query(baseQuery, orderBy('created', 'desc'));

      const querySnapshot = await getDocs(finalQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Erro ao listar localizações:', error);
      throw error;
    }
  }

  /**
   * Escuta localizações em tempo real
   */
  watchLocations(
    callback: (locations: Location[]) => void,
    filters?: { city?: string; state?: string }
  ) {
    try {
      const constraints: any[] = [];
      if (filters?.city) {
        constraints.push(where('city', '==', filters.city));
      }
      if (filters?.state) {
        constraints.push(where('state', '==', filters.state));
      }

      // Create query with collection reference
      const baseQuery = collection(this.db, this.locationsCollection);
      const finalQuery = constraints.length > 0
        ? query(baseQuery, ...constraints, orderBy('created', 'desc'))
        : query(baseQuery, orderBy('created', 'desc'));

      return onSnapshot(finalQuery, (snapshot) => {
        const locations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Location[];
        
        callback(locations);
      });
    } catch (error) {
      console.error('Erro ao escutar localizações:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService();