"use strict";
import {AliasTable, AliasMethod} from "@pocketberserker/akashic-random";
import {Servant} from "./Servant";

export interface Box {
  id: string;
  probabilities: number[];
  servants: string[];
}

export class Lot {
  private servants: Map<number, string[]>;
  private table: AliasTable;
  private alias: AliasMethod;

  constructor(box: Box, servants: Servant[]) {
    this.servants = new Map<number, string[]>();
    for (const id of box.servants) {
      const servant = servants.find(s => id === s.id);
      let group = this.servants.get(servant.rank);
      if (group) {
        group.push(id);
      } else {
        group = [id];
        this.servants.set(servant.rank, group);
      }
    }
    this.alias = new AliasMethod(g.game.random);
    this.table = this.alias.generate(box.probabilities);
  }

  draw() {
    const servants = this.servants.get(this.alias.get(this.table));
    return servants[g.game.random.get(0, servants.length)];
  }
}
