import { create } from 'zustand';
import type { Script, Folder, ScriptVersion, Playlist } from '../types';
import { supabaseStorage } from '../services/supabase/storageService';
import { LocalStorageService } from '../services/storage/localStorage';
import { isSupabaseConfigured } from '../services/supabase/client';

const localStorage = new LocalStorageService();

// Helper: pick the right backend (use local storage for test/guest mode)
const isGuestOrLocal = (userId?: string) => !userId || userId === 'test-creator-guest' || userId === 'local-user';
const useSupabase = (userId?: string) => isSupabaseConfigured() && !isGuestOrLocal(userId);

interface ScriptState {
  scripts: Script[];
  folders: Folder[];
  playlists: Playlist[];
  currentScript: Script | null;
  isLoading: boolean;
  searchQuery: string;
  activeFolderId: string | null;
  activePlaylistId: string | null;

  // Scripts
  loadScripts: (userId: string) => Promise<void>;
  createScript: (userId: string, title?: string, folderId?: string | null, playlistId?: string | null) => Promise<Script>;
  updateScript: (id: string, updates: Partial<Script>) => Promise<void>;
  deleteScript: (id: string) => Promise<void>;
  duplicateScript: (userId: string, id: string) => Promise<Script>;
  setCurrentScript: (script: Script | null) => void;
  loadScript: (id: string) => Promise<Script | null>;

  // Folders
  loadFolders: (userId: string) => Promise<void>;
  createFolder: (userId: string, name: string, color?: string) => Promise<void>;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  setActiveFolderId: (id: string | null) => void;

  // Playlists / Series
  loadPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (userId: string, name: string, description?: string, color?: string) => Promise<Playlist>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  setActivePlaylistId: (id: string | null) => void;

  // Search
  setSearchQuery: (query: string) => void;

  // Versions
  getVersions: (scriptId: string) => Promise<ScriptVersion[]>;
  createVersion: (scriptId: string) => Promise<void>;

  // Computed
  filteredScripts: () => Script[];
}

export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [],
  folders: [],
  playlists: [],
  currentScript: null,
  isLoading: false,
  searchQuery: '',
  activeFolderId: null,
  activePlaylistId: null,

  // ── Scripts ─────────────────────────────────────────────────────────────────

  loadScripts: async (userId) => {
    set({ isLoading: true });
    try {
      let scripts: Script[] = [];
      if (useSupabase(userId)) {
        try {
          scripts = await supabaseStorage.getScripts(userId);
        } catch (e) {
          console.warn('Supabase getScripts failed, falling back to localStorage:', e);
          scripts = localStorage.getScripts();
        }
      } else {
        scripts = localStorage.getScripts();
      }
      set({ scripts, isLoading: false });
    } catch (e) {
      console.error('loadScripts error:', e);
      set({ scripts: localStorage.getScripts(), isLoading: false });
    }
  },

  createScript: async (userId, title = 'Untitled Script', folderId = null, playlistId = null) => {
    let newScript: Script;
    if (useSupabase(userId)) {
      try {
        newScript = await supabaseStorage.createScript(userId, {
          title,
          folderId,
          playlistId,
          content: null,
          plainText: '',
        });
      } catch (e) {
        console.warn('Supabase createScript failed, falling back to localStorage:', e);
        newScript = localStorage.createScript({
          title,
          folderId,
          playlistId,
          content: null,
          plainText: '',
          userId,
        });
      }
    } else {
      newScript = localStorage.createScript({
        title,
        folderId,
        playlistId,
        content: null,
        plainText: '',
        userId,
      });
    }
    set((state) => ({ scripts: [newScript, ...state.scripts] }));
    return newScript;
  },

  updateScript: async (id, updates) => {
    const { currentScript } = get();
    const userId = currentScript?.userId;
    if (useSupabase(userId)) {
      try {
        await supabaseStorage.updateScript(id, updates);
      } catch (e) {
        console.warn('Supabase updateScript fallback to localStorage:', e);
        localStorage.updateScript(id, updates);
      }
    } else {
      localStorage.updateScript(id, updates);
    }
    set((state) => ({
      scripts: state.scripts.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      currentScript:
        state.currentScript?.id === id
          ? { ...state.currentScript, ...updates }
          : state.currentScript,
    }));
  },

  deleteScript: async (id) => {
    const { currentScript } = get();
    const userId = currentScript?.userId;
    if (useSupabase(userId)) {
      try {
        await supabaseStorage.deleteScript(id);
      } catch (e) {
        console.warn('Supabase deleteScript fallback to localStorage:', e);
        localStorage.deleteScript(id);
      }
    } else {
      localStorage.deleteScript(id);
    }
    set((state) => ({
      scripts: state.scripts.filter((s) => s.id !== id),
      currentScript: state.currentScript?.id === id ? null : state.currentScript,
    }));
  },

  duplicateScript: async (userId, id) => {
    let original: Script | null = null;
    if (useSupabase(userId)) {
      try {
        original = await supabaseStorage.getScript(id);
      } catch {
        original = localStorage.getScript(id);
      }
    } else {
      original = localStorage.getScript(id);
    }
    const title = original ? `${original.title} (Copy)` : 'Untitled Script (Copy)';
    let dup: Script;
    if (useSupabase(userId)) {
      try {
        dup = await supabaseStorage.createScript(userId, {
          ...original,
          title,
        });
      } catch {
        dup = localStorage.createScript({
          ...original,
          title,
          userId,
        });
      }
    } else {
      dup = localStorage.createScript({
        ...original,
        title,
        userId,
      });
    }
    set((state) => ({ scripts: [dup, ...state.scripts] }));
    return dup;
  },

  setCurrentScript: (script) => set({ currentScript: script }),

  loadScript: async (id) => {
    let script: Script | null = null;
    if (isSupabaseConfigured()) {
      try {
        script = await supabaseStorage.getScript(id);
      } catch {
        script = localStorage.getScript(id);
      }
    } else {
      script = localStorage.getScript(id);
    }
    if (!script) {
      script = localStorage.getScript(id);
    }
    if (script) {
      set({ currentScript: script });
    }
    return script;
  },

  // ── Folders ─────────────────────────────────────────────────────────────────

  loadFolders: async (userId) => {
    try {
      let folders: Folder[] = [];
      if (useSupabase(userId)) {
        try {
          folders = await supabaseStorage.getFolders(userId);
        } catch {
          folders = localStorage.getFolders();
        }
      } else {
        folders = localStorage.getFolders();
      }
      set({ folders });
    } catch (e) {
      console.error('loadFolders error:', e);
      set({ folders: localStorage.getFolders() });
    }
  },

  createFolder: async (userId, name, color) => {
    let folder: Folder;
    if (useSupabase(userId)) {
      try {
        folder = await supabaseStorage.createFolder(userId, name, color);
      } catch {
        folder = localStorage.createFolder(name, color);
      }
    } else {
      folder = localStorage.createFolder(name, color);
    }
    set((state) => ({ folders: [...state.folders, folder] }));
  },

  updateFolder: async (id, updates) => {
    let updated: Folder | null = null;
    if (isSupabaseConfigured()) {
      try {
        updated = await supabaseStorage.updateFolder(id, updates);
      } catch {
        updated = localStorage.updateFolder(id, updates);
      }
    } else {
      updated = localStorage.updateFolder(id, updates);
    }
    if (updated) {
      set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? updated! : f)),
      }));
    }
  },

  deleteFolder: async (id) => {
    if (isSupabaseConfigured()) {
      try {
        await supabaseStorage.deleteFolder(id);
      } catch {
        localStorage.deleteFolder(id);
      }
    } else {
      localStorage.deleteFolder(id);
    }
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
      activeFolderId: state.activeFolderId === id ? null : state.activeFolderId,
    }));
  },

  setActiveFolderId: (id) => set({ activeFolderId: id, activePlaylistId: null }),

  // ── Playlists / Series ───────────────────────────────────────────────────────

  loadPlaylists: async (userId) => {
    try {
      const playlists = localStorage.getPlaylists();
      set({ playlists });
    } catch (e) {
      console.error('loadPlaylists error:', e);
    }
  },

  createPlaylist: async (userId, name, description, color) => {
    const playlist = localStorage.createPlaylist(name, description, color);
    set((state) => ({ playlists: [...state.playlists, playlist] }));
    return playlist;
  },

  updatePlaylist: async (id, updates) => {
    const updated = localStorage.updatePlaylist(id, updates);
    set((state) => ({
      playlists: state.playlists.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deletePlaylist: async (id) => {
    localStorage.deletePlaylist(id);
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== id),
      activePlaylistId: state.activePlaylistId === id ? null : state.activePlaylistId,
      scripts: state.scripts.map((s) => s.playlistId === id ? { ...s, playlistId: null, episodeNumber: null } : s)
    }));
  },

  setActivePlaylistId: (id) => set({ activePlaylistId: id, activeFolderId: null }),

  // ── Search ──────────────────────────────────────────────────────────────────

  setSearchQuery: (query) => set({ searchQuery: query }),

  // ── Versions ────────────────────────────────────────────────────────────────

  getVersions: async (scriptId) => {
    try {
      if (isSupabaseConfigured()) {
        try {
          return await supabaseStorage.getVersions(scriptId);
        } catch {
          return localStorage.getVersions(scriptId);
        }
      }
      return localStorage.getVersions(scriptId);
    } catch {
      return localStorage.getVersions(scriptId);
    }
  },

  createVersion: async (scriptId) => {
    let script: Script | null = null;
    if (isSupabaseConfigured()) {
      try {
        script = await supabaseStorage.getScript(scriptId);
      } catch {
        script = localStorage.getScript(scriptId);
      }
    } else {
      script = localStorage.getScript(scriptId);
    }
    if (!script) return;
    if (isSupabaseConfigured()) {
      try {
        await supabaseStorage.createVersion(scriptId, script.content, script.plainText, script.wordCount ?? 0);
        return;
      } catch {
        localStorage.createVersion(scriptId, script.content, script.plainText, script.wordCount ?? 0);
      }
    } else {
      localStorage.createVersion(scriptId, script.content, script.plainText, script.wordCount ?? 0);
    }
  },

  // ── Computed ────────────────────────────────────────────────────────────────

  filteredScripts: () => {
    const { scripts, activeFolderId, activePlaylistId, searchQuery } = get();
    return scripts.filter((script) => {
      const matchesFolder = activeFolderId ? script.folderId === activeFolderId : true;
      const matchesPlaylist = activePlaylistId ? script.playlistId === activePlaylistId : true;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        script.title.toLowerCase().includes(q) ||
        (script.plainText && script.plainText.toLowerCase().includes(q));
      return matchesFolder && matchesPlaylist && matchesSearch;
    });
  },
}));
