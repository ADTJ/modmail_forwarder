import { Api } from "./api";
import { Request } from "../Request";

export module Me {

    export interface User {
        is_employee: boolean;
        seen_layout_switch: boolean;
        has_visited_new_profile: boolean;
        pref_no_profanity: boolean;
        has_external_account: boolean;
        pref_geopopular: string;
        seen_redesign_modal: boolean;
        pref_show_trending: boolean;
        subreddit: object;
        is_sponsor: boolean;
        gold_expiration: object;
        has_gold_subscription: boolean;
        num_friends: number;
        features: object;
        has_android_subscription: boolean;
        verified: boolean;
        new_modmail_exists: boolean;
        pref_autoplay: boolean;
        coins: number;
        has_paypal_subscription: boolean;
        has_subscribed_to_premium: boolean;
        id: string;
        has_stripe_subscription: boolean;
        seen_premium_adblock_modal: boolean;
        can_create_subreddit: boolean;
        over_18: boolean;
        is_gold: boolean;
        is_mod: boolean;
        suspension_expiration_utc: object;
        has_verified_email: boolean;
        is_suspended: boolean;
        pref_video_autoplay: boolean;
        in_chat: boolean;
        in_redesign_beta: boolean;
        icon_img: string;
        has_mod_mail: boolean;
        pref_nightmode: boolean;
        oauth_client_id: string;
        hide_from_robots: boolean;
        link_karma: number;
        force_password_reset: boolean;
        seen_give_award_tooltip: boolean;
        inbox_count: number;
        pref_top_karma_subreddits: boolean;
        has_mail: boolean;
        pref_show_snoovatar: boolean;
        name: string;
        pref_clickgadget: number;
        created: number;
        gold_creddits: number;
        created_utc: number;
        has_ios_subscription: boolean;
        pref_show_twitter: boolean;
        in_beta: boolean;
        comment_karma: number;
        has_subscribed: boolean;
        seen_subreddit_chat_ftux: boolean;

        created_date: Date; //added by this layer
    }

    export async function get(apiParams: Api.Params) {
        const endpoint = 'v1/me';
        let url = `${apiParams.url.split('/').filter(x => x).join('/')}/${endpoint}`;
        let { response } = Request.get<User>(url, {
            parseJson: true,
            headers: [["Authorization", `Bearer ${apiParams.authToken.access_token}`]]
        });

        const ONE_SECOND_MS = 1000;

        let user = await response;
        user.has_verified_email = !!user.has_verified_email; //This can sometimes be null (apparently)
        user.created_date = new Date(user.created_utc * ONE_SECOND_MS);

        return user;
    }
}