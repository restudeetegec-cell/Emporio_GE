(function () {
    "use strict";

    const baseUrl = new URL(window.EMPORIO_API_BASE_URL).href.replace(/\/+$/, "");
    const siteRoot = new URL("../", document.currentScript.src);
    const pageSize = 100;

    async function getJson(url) {
        const response = await fetch(url, { credentials: "omit" });
        if (!response.ok) {
            throw new Error(`Falha ao carregar dados da loja (HTTP ${response.status}).`);
        }
        return response.json();
    }

    async function listAll(resource) {
        const items = [];
        let after = null;

        while (true) {
            const url = new URL(`${baseUrl}/${resource}`);
            url.searchParams.set("first", String(pageSize));
            if (after) url.searchParams.set("after", after);

            const page = await getJson(url);
            if (!Array.isArray(page.items) || !Number.isInteger(page.pagination?.total_count)) {
                throw new Error(`Resposta inválida para ${resource}.`);
            }

            items.push(...page.items);
            if (items.length >= page.pagination.total_count || page.items.length === 0) {
                return items;
            }

            const nextCursor = page.items.at(-1)?.id;
            if (!nextCursor || nextCursor === after) {
                throw new Error(`Paginação inválida para ${resource}.`);
            }
            after = nextCursor;
        }
    }

    function activeOffers(offers, now = new Date()) {
        const byProduct = new Map();
        for (const offer of offers) {
            const starts = new Date(offer.starts_at);
            const ends = new Date(offer.ends_at);
            if (!offer.is_active || !Number.isFinite(offer.promo_price) ||
                starts > now || ends <= now || Number.isNaN(starts.getTime()) ||
                Number.isNaN(ends.getTime())) continue;

            const current = byProduct.get(offer.product_id);
            if (!current || offer.promo_price < current.promo_price) {
                byProduct.set(offer.product_id, offer);
            }
        }
        return byProduct;
    }

    const formatBRL = (cents) => (cents / 100).toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    });

    window.EmporioAPI = Object.freeze({
        listProducts: () => listAll("products"),
        listOffers: () => listAll("offers"),
        getProduct: (id) => getJson(new URL(`${baseUrl}/products/${encodeURIComponent(id)}`)),
        activeOffers,
        formatBRL,
        assetUrl: (url) => typeof url === "string" && url.startsWith("https://") ? url : "",
        productUrl: (id) => new URL(`produto.html?id=${encodeURIComponent(id)}`, siteRoot).href
    });
})();
