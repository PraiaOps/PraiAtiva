import { db } from '@/config/firebase';
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
  serverTimestamp
} from 'firebase/firestore';
import { Location } from '@/types';

class LocationService {
  private locationsCollection = 'locations';

  /**
   * Cria uma nova localização
   */
  async createLocation(location: Omit<Location, 'id'>): Promise<string> {
    try {
      const locationRef = await addDoc(collection(db, this.locationsCollection), {
        ...location,
        created: serverTimestamp(),
        updated: serverTimestamp()
      });

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
      const locationRef = doc(db, this.locationsCollection, id);
      await updateDoc(locationRef, {
        ...location,
        updated: serverTimestamp()
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
      const locationRef = doc(db, this.locationsCollection, id);
      const locationDoc = await getDoc(locationRef);
      
      if (locationDoc.exists()) {
        return {
          id: locationDoc.id,
          ...locationDoc.data()
        } as Location;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar localização:', error);
      throw error;
    }
  }

  /**
   * Lista localizações com filtros
   */
  async listLocations(filters?: {
    city?: string;
    state?: string;
    type?: string;
  }): Promise<Location[]> {
    try {
      let q = collection(db, this.locationsCollection);
      
      if (filters) {
        const constraints = [];
        
        if (filters.city) {
          constraints.push(where('city', '==', filters.city));
        }
        
        if (filters.state) {
          constraints.push(where('state', '==', filters.state));
        }
        
        if (filters.type) {
          constraints.push(where('type', '==', filters.type));
        }
        
        q = query(q, ...constraints, orderBy('created', 'desc'));
      } else {
        q = query(q, orderBy('created', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
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
  subscribeToLocations(callback: (locations: Location[]) => void, filters?: {
    city?: string;
    state?: string;
    type?: string;
  }) {
    let q = collection(db, this.locationsCollection);
    
    if (filters) {
      const constraints = [];
      
      if (filters.city) {
        constraints.push(where('city', '==', filters.city));
      }
      
      if (filters.state) {
        constraints.push(where('state', '==', filters.state));
      }
      
      if (filters.type) {
        constraints.push(where('type', '==', filters.type));
      }
      
      q = query(q, ...constraints, orderBy('created', 'desc'));
    } else {
      q = query(q, orderBy('created', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const locations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
      
      callback(locations);
    });
  }

  /**
   * Busca localizações por cidade
   */
  async getLocationsByCity(city: string): Promise<Location[]> {
    try {
      const q = query(
        collection(db, this.locationsCollection),
        where('city', '==', city),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Erro ao buscar localizações por cidade:', error);
      throw error;
    }
  }

  /**
   * Busca localizações por estado
   */
  async getLocationsByState(state: string): Promise<Location[]> {
    try {
      const q = query(
        collection(db, this.locationsCollection),
        where('state', '==', state),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Erro ao buscar localizações por estado:', error);
      throw error;
    }
  }

  /**
   * Busca localizações por tipo
   */
  async getLocationsByType(type: string): Promise<Location[]> {
    try {
      const q = query(
        collection(db, this.locationsCollection),
        where('type', '==', type),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Erro ao buscar localizações por tipo:', error);
      throw error;
    }
  }

  /**
   * Busca localizações próximas
   */
  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radiusInKm: number
  ): Promise<Location[]> {
    try {
      // Implementar lógica de busca por proximidade
      // Por enquanto retorna todas as localizações
      const q = query(
        collection(db, this.locationsCollection),
        orderBy('created', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
    } catch (error) {
      console.error('Erro ao buscar localizações próximas:', error);
      throw error;
    }
  }
}

export const locationService = new LocationService(); 