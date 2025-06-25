import { DataStoreService } from "@rbxts/services";
import { Service } from "@flamework/core";

@Service({ loadOrder: -1 })
export class Data {
	private PlayerData = DataStoreService.GetDataStore("PlayerData");
	private PlayerCache: Map<string, __data> = new Map();

	private cloneDefaultData(): __data {
		return {
			Coins: 0,
			Diamonds: 0,
			Wins: 0,
		};
	}

	public getCache(player: Player) {
		const key = `player_${player.UserId}`;
		return this.PlayerCache.get(key);
	}

	public initData(player: Player) {
		const key = `player_${player.UserId}`;

		const [_, data] = pcall(() => {
			return this.PlayerData.GetAsync(key);
		});

		if (!data) {
			pcall(() => {
				this.PlayerData.SetAsync(key, this.cloneDefaultData());
			});
			this.PlayerCache.set(key, this.cloneDefaultData());
			return;
		}

		this.PlayerCache.set(key, data as __data);
	}

	public saveData(player: Player) {
		const key = `player_${player.UserId}`;
		const cache = this.PlayerCache.get(key);

		if (!cache) return;

		pcall(() => {
			this.PlayerData.UpdateAsync(key, (oldData) => {
				if (!oldData) return $tuple(cache);

				const updatedData: __data = {
					...oldData,
					Coins: cache.Coins,
					Diamonds: cache.Diamonds,
					Wins: cache.Wins,
				};

				return $tuple(updatedData);
			});
		});
	}

	public leaveData(player: Player) {
		const key = `player_${player.UserId}`;

		this.saveData(player);

		this.PlayerCache.delete(key);
	}

	public excludeData(player: Player) {
		const key = `player_${player.UserId}`;

		this.PlayerCache.delete(key);

		pcall(() => {
			this.PlayerData.RemoveAsync(key);
		});
	}
}
