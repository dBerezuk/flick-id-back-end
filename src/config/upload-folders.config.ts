class UploadFolders {
	private readonly media: string = '/media';
	private readonly user: string = '/user';

	constructor() {}

	getMediaFullPosters(path: string = ''): string {
		return `${this.media}/full-posters/` + path;
	}

	getMediaPosters(path: string = ''): string {
		return `${this.media}/posters/` + path;
	}

	getMediaVideos(path: string = ''): string {
		return `${this.media}/videos/` + path;
	}

	getUserAvatars(path: string = ''): string {
		return `${this.user}/avatars/` + path;
	}

	getAll(): string[] {
		return [
			this.getMediaFullPosters(),
			this.getMediaPosters(),
			this.getMediaVideos(),
			this.getUserAvatars(),
		];
	}
}

export const UPLOAD_FOLDERS = new UploadFolders();
