export interface KeyValuePair {
  key: string;
  value: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

export interface Request {
  id: string;
  folderId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  createdAt: number;
  updatedAt: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export interface ExecutePayload {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string | null;
}

export interface ExecuteResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  duration: number;
}

export interface ApiSuccessResponse {
  success: true;
  data: ExecuteResponseData;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export type EditorTab = 'params' | 'headers' | 'body';

export type TreeNodeType = 'folder' | 'request';

export interface TreeNode {
  id: string;
  type: TreeNodeType;
  name: string;
  parentId: string | null;
  children?: TreeNode[];
}

export interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
  nodeType: TreeNodeType;
}

export interface ResponseState {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  duration: number;
  error?: string;
}

export interface UISettings {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  activeRequestId: string | null;
  activeTab: EditorTab;
}
