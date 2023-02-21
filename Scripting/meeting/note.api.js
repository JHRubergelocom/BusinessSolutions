import { solutionApi } from "@elo/sol-core";
import { NoteFactory } from "../entity/NoteFactory";
import NoteUtils from "../entity/NoteUtils";
import { rfConst } from "../utils/note.const";


export default {

  DEFAULT_OPTIONS : {
    includeResult: true
  },

  async findNotesByMeetingItem(itemId) {
    try {
      const response =  await solutionApi.callRegisteredFunction(rfConst.FIND_MEETINGITEM_NOTES, {
        objId: itemId
      });
      if (response.sords) {
        const { sords, ...rest } = response;
        return {...rest, sords: sords.map(note => NoteFactory.create(note))};
      }
      throw Error("sords property is missing on response");
    } catch (ex) {
      console.warn(ex);
      throw ex;
    }
  },

  /**
   * @param {Object} note
   */
  async createNote(folderId, note) {
    const options = { includeResult : true };
    let params = {};


    if (note.visibility === "PR") {
      // create into chaos cabinet workflow will move to private area
      params = { targetFolder: 0}
    } else {
      // expose root folder. With that we can find public notes folder in elo
      // targetFolder will be calculate dynamically on server side
      params = { rootId: folderId }
    }

    return solutionApi.callRegisteredFunction(rfConst.CREATE_NOTE, {
      source: note,
      params,
      options
    });
  },

  async editNote(note) {
    const options = { includeResult: true };
    const source = {
      desc: note.text,
      objKeys: {
        "MEETING_NOTE_TITLE": note.title,
        "MEETING_NOTE_MINUTES_RELEVANT": note.minutesRelevant ? "1": "0",
        "MEETING_NOTE_VISIBILITY": note.visibility
      }
    }
    return solutionApi.callRegisteredFunction(rfConst.EDIT_NOTE, {
      objId: note.id,
      source,
      options
    });
  },

  /**
   *
   * @param {Note} note
   * @throws exception when note is not instanceOf Note
   * @returns
   */
  async deleteNote(note){
    if (NoteUtils.isNote(note)) {
      return solutionApi.callRegisteredFunction(rfConst.DELETE_NOTE, { objId: note.id });
    } else {
      throw Error("Note object is not instanceOf Note", note);
    }
  }
}