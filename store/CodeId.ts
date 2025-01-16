type StringOrNull = string | null;

interface Code {
	code: StringOrNull;
	title: StringOrNull;
	_id: StringOrNull;
	createdAt: StringOrNull;
}

export const useCodeID = defineStore("CodeID", {
	state: (): Code => ({
		code: null,
		title: null,
		_id: null,
		createdAt: null
	}),

	getters: {
		getCodeID: (state): Code => state
	},

	actions: {
		saveCodeID(code: Partial<Code>): void {
			this.code = code.code ?? this.code;
			this.title = code.title ?? this.title;
			this._id = code._id ?? this._id;
			this.createdAt = code.createdAt ?? this.createdAt;
		}
	}
});
