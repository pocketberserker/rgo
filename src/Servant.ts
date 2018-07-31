"use strict";
import {Ruby, Variable} from "@cowlick/core";

export type Class =
  | "Saber"
  | "Archer"
  | "Lancer"
  | "Rider"
  | "Caster"
  | "Berserker"
  | "Assassin"
  | "Shilder"
  | "Ruler"
  | "Avenger"
  | "MoonCancer"
  | "AlterEgo"
  | "Foreigner";

export interface Servant {
  id: string;
  name: string;
  klass: Class;
  assetId: string;
  greeting: (string | Ruby[] | Variable)[];
  rank: number;
}

const deserialize = (text: string): Servant[] => {
  return JSON.parse(text);
};
export const servants = deserialize((g.game.assets["servants"] as g.TextAsset).data);

export const makeServantCard = (scene: g.Scene, servant: Servant) => {
  const pane = new g.Pane({
    scene,
    width: 420,
    height: 720,
    backgroundImage: scene.assets["purple"] as g.ImageAsset
  });
  const servantSprite = new g.Sprite({
    scene,
    src: scene.assets[servant.assetId] as g.ImageAsset,
    x: -20
  });
  servantSprite.scale(420 / 520);
  pane.append(servantSprite);
  let assetId: string;
  if (servant.rank < 3) {
    assetId = "bronze";
  } else if (servant.rank === 3) {
    assetId = "silver";
  } else {
    assetId = "gold";
  }
  const waku = new g.Sprite({
    scene,
    src: scene.assets[assetId] as g.ImageAsset
  });
  pane.append(waku);
  return pane;
};
