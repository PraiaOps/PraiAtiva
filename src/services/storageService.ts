import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

class StorageService {
  private storage = getStorage();

  /**
   * Faz upload de um arquivo
   */
  async uploadFile(
    file: File,
    path: string,
    metadata?: {
      contentType?: string;
      customMetadata?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const fullPath = `${path}/${fileName}`;
      
      const storageRef = ref(this.storage, fullPath);
      await uploadBytes(storageRef, file, metadata);
      
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  }

  /**
   * Faz upload de uma imagem
   */
  async uploadImage(
    file: File,
    path: string,
    metadata?: {
      customMetadata?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      return this.uploadFile(file, path, {
        contentType: file.type,
        customMetadata: metadata?.customMetadata
      });
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }

  /**
   * Faz upload de um vídeo
   */
  async uploadVideo(
    file: File,
    path: string,
    metadata?: {
      customMetadata?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      return this.uploadFile(file, path, {
        contentType: file.type,
        customMetadata: metadata?.customMetadata
      });
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      throw error;
    }
  }

  /**
   * Faz upload de um documento
   */
  async uploadDocument(
    file: File,
    path: string,
    metadata?: {
      customMetadata?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      return this.uploadFile(file, path, {
        contentType: file.type,
        customMetadata: metadata?.customMetadata
      });
    } catch (error) {
      console.error('Erro ao fazer upload do documento:', error);
      throw error;
    }
  }

  /**
   * Deleta um arquivo
   */
  async deleteFile(url: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, url);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Obtém URL de download
   */
  async getDownloadUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erro ao obter URL de download:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService(); 