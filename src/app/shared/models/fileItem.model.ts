export interface FileItem {
    created_at: string;
    file_name: string;
    id: string;
    image_url?: Promise<any>;
    private: boolean;
    title: string;
    user_id: string;
    creator?: boolean;
  }