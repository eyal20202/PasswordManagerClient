import axios from 'axios';
import { SecretNote } from '../models/SecretNote';
// service that talk with the DB
class SecretNoteService {
  // private apiUrl = 'https://localhost:8443/api/secret-notes';
  private apiUrl = 'http://localhost:8080/api/secret-notes';
  private authToken = btoa('eyal:miz');

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${this.authToken}`,
    };
  }

  async getAllSecretNotes(): Promise<SecretNote[]> {
    const response = await axios.get<SecretNote[]>(this.apiUrl, { headers: this.getHeaders() });
    return response.data;
  }

  async createSecretNote(secretNote: SecretNote): Promise<SecretNote> {
    const response = await axios.post<SecretNote>(this.apiUrl, secretNote, { headers: this.getHeaders() });
    return response.data;
  }

  async updateSecretNote(id: number, secretNote: SecretNote): Promise<SecretNote> {
    const response = await axios.put<SecretNote>(`${this.apiUrl}/${id}`, secretNote, { headers: this.getHeaders() });
    return response.data;
  }

  async deleteSecretNote(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

export default new SecretNoteService();