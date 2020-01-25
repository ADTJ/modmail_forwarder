import { Api } from "./api";
import { Request } from "../Request";

export module Mod {
    export async function get(apiParams: Api.Params) {

    }

    export module Conversations {

        export interface ConversationsResponse {
            //TODO
        }

        /**
         * Get conversations for a logged in user or subreddits
         * @param params Additional filters
         */
        export async function get(apiParams: Api.Params, params?: {
            /** base36 modmail conversation id */
            after?: string;
            /** comma-delimited list of subreddit names */
            entity?: string;
            /** an integer (default: 25) */
            limit?: number,
            /** one of (recent, mod, user, unread) */
            sort?: "recent" | "mod" | "user" | "unread",
            /** one of (new, inprogress, mod, notifications, archived, highlighted, all) */
            state?: "new" | "inprogress" | "mod" | "notifications" | "archived" | "highlighted" | "all"
        }) {
            const endpoint = 'mod/conversations';
            let url = `${apiParams.url.split('/').filter(x => x).join('/')}/${endpoint}?${Request.formEncode(params ?? {})}`;
            let { response } = Request.get<ConversationsResponse>(url, {
                parseJson: true,
                headers: [["Authorization", `Bearer ${apiParams.authToken.access_token}`]]
            });

            let conversations = await response;
            return conversations;
        }
    
        export module Unread {

            export interface MessageCountResponse {
                highlighted: number;
                notifications: number;
                archived: number;
                new: number;
                inprogress: number;
                mod: number
            }

            export async function count(apiParams: Api.Params) {
                const endpoint = 'mod/conversations/unread/count';
                let url = `${apiParams.url.split('/').filter(x => x).join('/')}/${endpoint}`;
                let { response } = Request.get<MessageCountResponse>(url, {
                    parseJson: true,
                    headers: [["Authorization", `Bearer ${apiParams.authToken.access_token}`]]
                });

                let unreadCount = await response;
                return unreadCount;
            }
        }
    }
}