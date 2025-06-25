import { Service, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

@Service({})
export class DisableCollision implements OnStart {
	private turnOffCollision(character: Model) {
		for (const part of character.GetDescendants()) {
			if (part.IsA("BasePart")) {
				part.CollisionGroup = "Players";
			}
		}
	}

	onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				this.turnOffCollision(character);
			});
		});

		for (const player of Players.GetPlayers()) {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			if (character) {
				this.turnOffCollision(character);
			}
		}
	}
}
