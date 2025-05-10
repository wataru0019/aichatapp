<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import "../app.css";

    import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
    import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
    import type { LayoutLoad } from './$types'

  let { data, children } = $props()

    export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth')

    const supabase = isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
            fetch,
            },
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            global: {
            fetch,
            },
            cookies: {
            getAll() {
                return data.cookies
            },
            },
        })

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return { session, supabase, user }
    }

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="flex flex-col h-screen">
    <Header />
    <div class="flex-1 overflow-auto">
        {@render children()}
    </div>
</div>