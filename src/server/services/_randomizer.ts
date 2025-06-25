import { Service } from "@flamework/core";
@Service({})
export class _randomizer {
	public getRandomInt() {
		return math.floor(math.random() * 999999);
	}
}
