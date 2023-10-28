import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface TimerDoc extends BaseDoc {
  time: Date;
  pause: Date | undefined;
  owner: ObjectId;
}

export default class TimerConcept {
  public readonly timers = new DocCollection<TimerDoc>("timers");

  async create(owner: ObjectId) {
    const _id = await this.timers.createOne({ time: new Date(), owner: owner, pause: undefined });
    return { msg: "Timer successfully created!", timer: await this.timers.readOne({ _id }) };
  }

  async getTimeById(_id: ObjectId) {
    const timer = await this.timers.readOne({ _id });
    if (!timer) {
      throw new NotFoundError("Timer does not exist!");
    }
    const currTime = new Date();
    if (!timer.pause) {
      return { msg: "Time successfully found!", time: (currTime.getTime() - timer.time.getTime()) / 1000 };
    } else {
      return { msg: "Time successfully found!", time: (timer.pause.getTime() - timer.time.getTime()) / 1000 };
    }
  }

  async pauseTimeByOwner(owner: ObjectId) {
    const timer = await this.timers.readOne({ owner });
    if (!timer) {
      throw new NotFoundError("Timer does not exist!");
    }
    if (timer.pause) {
      throw new NotAllowedError("Timer is already paused!");
    }
    await this.timers.updateOne({ owner }, { pause: new Date() });
    return { msg: "Timer paused!" };
  }

  async playTimeByOwner(owner: ObjectId) {
    const timer = await this.timers.readOne({ owner });
    if (!timer) {
      throw new NotFoundError("Timer does not exist!");
    }
    if (!timer.pause) {
      console.warn("Timer was already playing! Resetting...");
      timer.pause = new Date();
    }

    // Move the start time backwards
    const newStart = new Date(new Date().getTime() - (timer.pause.getTime() - timer.time.getTime()));

    await this.timers.updateOne({ owner }, { time: newStart, pause: undefined });
    return { msg: "Timer unpaused!" };
  }

  async getTimeByOwner(owner: ObjectId) {
    const timer = await this.timers.readOne({ owner });
    if (!timer) {
      throw new NotFoundError("Timer does not exist!");
    }
    const currTime = new Date();
    return { msg: "Time successfully found!", time: (currTime.getTime() - timer.time.getTime()) / 1000 };
  }

  async getTimers() {
    return await this.timers.readMany({});
  }

  async resetByOwner(owner: ObjectId) {
    const timer = await this.timers.updateOne({ owner }, { time: new Date() });
    return { msg: "Timer successfully reset", timer: timer };
  }

  async delete(owner: ObjectId) {
    await this.timers.deleteOne({ owner });
    return { msg: "Timer successfully deleted!" };
  }
}
