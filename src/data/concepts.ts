export interface ConceptContent {
  definition: string;
  realWorldExample: string;
}

export const CONCEPT_CONTENT: Record<string, ConceptContent> = {
  "supply-demand": {
    definition:
      "Supply and demand is the most basic law in economics. When a lot of people want something (high demand) and there isn't much of it available (low supply), the price goes up. When nobody wants something or there's too much of it, the price drops. This is why limited sneaker drops sell for way more than retail.",
    realWorldExample:
      "When VIZN announced an exclusive deal with a major artist, millions of fans rushed to subscribe. More people wanting the stock meant the price shot up — just like how a limited Jordan colorway sells out in minutes and gets flipped for triple the price.",
  },
  "bull-bear": {
    definition:
      "A bull market is when stock prices are rising and people feel good about investing — like a bull charging forward. A bear market is when prices are falling and investors are scared — like a bear swiping downward. Both happen naturally in cycles, and knowing which one you're in changes your whole strategy.",
    realWorldExample:
      "During Black History Month, Black-owned brands get a lot of attention and investment, pushing prices up — that's a mini bull run. But when a recession hits and people stop spending, even great companies see their stock drop. Smart investors prepare for both.",
  },
  "buy-sell-basics": {
    definition:
      "Buying a stock means you're purchasing a small ownership stake in a company. Selling means you're giving up that stake in exchange for cash. You make money by selling for more than you paid, and lose money if you sell for less. The goal is to buy low and sell high — but timing that perfectly is harder than it sounds.",
    realWorldExample:
      "You buy 10 shares of CROWN at $47 each. A few weeks later, a celebrity posts about their natural hair journey and CROWN blows up. The price jumps to $62 per share. You sell all 10 shares and walk away with $150 in profit. That's the basic buy-sell cycle.",
  },
  "profit-loss": {
    definition:
      "Profit is the money you make when you sell something for more than you paid. Loss is when you sell for less than you paid. Businesses track profit and loss (P&L) to know if they're actually winning or just spinning their wheels. As an investor, your P&L tells you if your decisions are working.",
    realWorldExample:
      "You bought BLOC at $34 and sold at $28. That's a $6-per-share loss — you lost money on that trade. But if you bought STAX at $68 and sold at $85, that's a $17-per-share profit. Your overall P&L is what's left after you add up all your wins and losses.",
  },
  "portfolio-value": {
    definition:
      "Your portfolio value is the total worth of everything you own — your cash plus the current market value of all your stocks. Net worth works the same way in real life: it's everything you own minus everything you owe. It changes every day as stock prices move, even if you haven't made any trades.",
    realWorldExample:
      "You start with $10,000. You put $3,000 into stocks and keep $7,000 in cash. If your stocks grow to $3,800, your portfolio is now worth $10,800. Even though you never touched your cash, your net worth went up because your investments gained value.",
  },
  diversification: {
    definition:
      "Diversification means spreading your money across different types of investments so that one bad day doesn't wipe you out. If you put everything into one stock and it crashes, you lose everything. But if you're in multiple sectors, a loss in one area can be offset by gains in another.",
    realWorldExample:
      "You own VIZN (streaming), CROWN (beauty), VAULT (finance), and PIXL (gaming). When a streaming scandal hits and VIZN drops 12%, your other stocks barely move. Because you diversified, you only lost a fraction of your total portfolio instead of taking the full hit.",
  },
  "sector-correlation": {
    definition:
      "Stocks in the same sector tend to move together because they're affected by the same news, trends, and economic conditions. This is called sector correlation. If a music festival drives streams up, both RYTHM and BLOC might rise at the same time — they're correlated.",
    realWorldExample:
      "A viral cultural moment boosts interest in Black fashion. DRIP, RARE, and THREAD all jump on the same day because they're all in the fashion sector. Owning all three means you benefit more when the sector wins — but you also take a bigger hit when the whole sector drops.",
  },
  "emotional-investing": {
    definition:
      "Emotional investing is when you make trades based on fear, hype, or gut feelings instead of data and strategy. It often leads to buying high (when everyone's excited) and selling low (when everyone panics). Disciplined investors stick to their plan even when the market gets wild.",
    realWorldExample:
      "A negative news story drops about NETFLO and you immediately sell in a panic — only for the stock to bounce back 8% the next day. That's emotional investing. A disciplined investor would've checked the fundamentals first, realized the drop was temporary, and held on.",
  },
  "consumer-spending": {
    definition:
      "Consumer spending power refers to how much money regular people have available to spend on goods and services. When people have more money — from jobs, tax refunds, or stimulus — they spend more, which helps consumer-facing companies grow. When money gets tight, spending drops and those same companies suffer.",
    realWorldExample:
      "Tax season hits and millions of Black households get refunds. People splurge on beauty products, sneakers, and streaming subscriptions. Companies like CROWN, KICKS, and VIZN all see a spike in revenue — and their stock prices follow as investors expect stronger earnings.",
  },
  "economic-multiplier": {
    definition:
      "The economic multiplier effect means that one dollar spent in the right place can generate far more than a dollar of economic activity. When money circulates within a community — spent at local businesses, reinvested in local services — the impact multiplies. This is why Black economic solidarity has such outsized power.",
    realWorldExample:
      "VAULT (a Black-owned bank) gets a major deposit from a local nonprofit. That money is loaned to a Black contractor who builds affordable housing. The construction workers spend their wages at Black-owned restaurants. One deposit turned into jobs, housing, and more spending — the multiplier in action.",
  },
  "dividend-investing": {
    definition:
      "A dividend is a portion of a company's profits paid directly to shareholders, usually on a regular schedule. Companies that pay dividends give investors two ways to make money: the stock price going up (capital gains) and regular cash payments (dividends). Dividend investing is a strategy focused on building steady income.",
    realWorldExample:
      "VAULT announces a quarterly dividend of $0.25 per share. If you own 100 shares, you receive $25 every three months just for holding the stock — that's $100 a year in passive income. Over time, if you reinvest those dividends to buy more shares, your earnings compound and grow faster.",
  },
  "halo-effect": {
    definition:
      "The halo effect in business is when one positive association — a celebrity, a partnership, a cultural moment — makes the entire brand look better in people's eyes. Investors anticipate more sales and attention, so the stock price rises even before any actual revenue increase happens.",
    realWorldExample:
      "DRIP announces a collaboration with a Grammy-winning artist. The brand wasn't in trouble, but now everyone's watching. Fans become potential customers, media coverage spikes, and investors assume sales will jump. DRIP's stock climbs 15% on the news alone — that's the halo effect doing its work.",
  },
  "competitive-displacement": {
    definition:
      "Competitive displacement happens when one company wins market share at the direct expense of a competitor. When customers leave one brand for another, the loser's revenue drops and their stock often falls while the winner's stock rises. In tight sectors, it can be zero-sum.",
    realWorldExample:
      "VIZN launches an exclusive original series that pulls subscribers away from NETFLO. VIZN's stock jumps 10% on the news. At the same time, NETFLO's subscriber numbers drop and their stock falls 7%. If you held VIZN and shorted NETFLO, you'd have won on both sides of the trade.",
  },
  "pe-ratio": {
    definition:
      "The price-to-earnings (P/E) ratio tells you how much investors are willing to pay for every dollar of a company's profit. A high P/E means investors expect big future growth. A low P/E might mean the company is undervalued — or that investors don't trust its future. It's one of the most used tools to judge whether a stock is fairly priced.",
    realWorldExample:
      "SCREEN earns $2 per share in profit this year. Its stock trades at $50. That's a P/E of 25 — investors are paying $25 for every $1 of earnings. Compare that to a competitor with a P/E of 10, and SCREEN looks expensive. But if the market believes SCREEN's next film will triple profits, that premium might be worth it.",
  },
  "economic-moat": {
    definition:
      "An economic moat is a company's ability to protect its market position and profits from competitors. Like a moat around a castle, it keeps rivals out. Moats can come from brand loyalty, proprietary technology, exclusive partnerships, high switching costs, or cost advantages. Companies with wide moats tend to be safer long-term investments.",
    realWorldExample:
      "KICKS has a cult following, exclusive athlete endorsements, and retail partnerships that took years to build. A new sneaker brand tries to compete but can't replicate that trust or those deals. KICKS keeps its customers even when the new brand cuts prices. That loyalty and network is their economic moat.",
  },
  "risk-adjusted-return": {
    definition:
      "Risk-adjusted return measures how much profit you made relative to how much risk you took to get it. Making 20% by betting everything on one stock is very different from making 20% with a diversified, balanced portfolio. Smart investors care about returns AND the risk taken — not just the headline number.",
    realWorldExample:
      "Investor A puts everything into one stock and gains 30%. Investor B spreads across 8 stocks in different sectors and gains 25%. Investor A made more, but one bad event could've wiped them out. Investor B's return was nearly as high with much less risk — a better risk-adjusted performance.",
  },
  "dollar-cost-avg": {
    definition:
      "Dollar cost averaging (DCA) is the strategy of investing a fixed amount of money at regular intervals, regardless of price. When prices are low, your fixed amount buys more shares. When prices are high, it buys fewer. Over time, this smooths out volatility and lowers your average cost per share.",
    realWorldExample:
      "Every month you invest $100 in RYTHM. In January the price is $50 — you get 2 shares. In February it drops to $40 — you get 2.5 shares. In March it rebounds to $60 — you get 1.67 shares. Your average cost per share is lower than $60, which means you're already in profit when others who bought all at once at $60 are just breaking even.",
  },
  "acquisition-economics": {
    definition:
      "An acquisition is when one company buys another company. The buying company pays a premium above the current stock price to convince shareholders to sell. Acquisitions can create value by combining resources, eliminating competition, or expanding into new markets — but they can also destroy value if the buyer overpays or the merger goes poorly.",
    realWorldExample:
      "SCREEN acquires a smaller indie film studio for $50M. SCREEN's stock initially dips because investors worry about the cost. But a year later, the studio's content library starts generating $20M a year in streaming royalties. The acquisition paid off — SCREEN added a revenue stream they couldn't have built from scratch as quickly.",
  },
  "vc-dilution": {
    definition:
      "When a startup raises venture capital (VC), it gives investors new shares in exchange for funding. This creates more shares in circulation, which means each existing share represents a smaller ownership percentage — that's dilution. Early investors and founders see their slice of the pie shrink, even if the company itself is growing.",
    realWorldExample:
      "STAX has 1 million shares outstanding. A VC firm invests $5M in exchange for 200,000 new shares. Now there are 1.2 million shares total. If you owned 10,000 shares before (1% of the company), you now own less than 0.84%. The company got capital to grow, but your ownership got diluted. If STAX uses that money to 10x the business, it's still worth it.",
  },
  "portfolio-rebalancing": {
    definition:
      "Portfolio rebalancing is the process of buying and selling investments to return to your target allocation. If one sector explodes in value and becomes 60% of your portfolio, you're now overexposed there. Rebalancing means selling some of the winner and buying into underrepresented sectors to maintain the diversification you planned.",
    realWorldExample:
      "Your portfolio starts balanced across 5 sectors at 20% each. After a huge fashion boom, your fashion stocks now make up 45% of your portfolio. To rebalance, you sell some DRIP and RARE and use that money to buy more VAULT and BLOK. You're locking in some of your fashion gains while reducing your risk if fashion cools off.",
  },
  inflation: {
    definition:
      "Inflation is when the general price of goods and services rises over time, which means your money buys less than it used to. When inflation is high, the government often raises interest rates to slow spending, which can hurt stock prices. Inflation hits communities with less savings especially hard because rising costs eat up a bigger share of their income.",
    realWorldExample:
      "Inflation spikes and groceries, rent, and gas all get more expensive. People cut back on streaming services, new clothes, and beauty products. Companies like VIZN, DRIP, and CROWN see revenue drop because consumers are tightening their budgets. Their stock prices fall as investors expect weaker earnings ahead.",
  },
  "consumer-confidence": {
    definition:
      "Consumer confidence measures how optimistic people feel about the economy and their own financial situation. When confidence is high, people spend freely, which boosts businesses. When confidence drops — due to job losses, rising costs, or economic uncertainty — people hold onto their money, and consumer-facing companies suffer.",
    realWorldExample:
      "A major jobs report comes out showing record employment. People feel secure about their income and start splurging on sneakers, subscriptions, and salon visits. KICKS, VIZN, and SHEEN all rally on the news because investors know that confident consumers spend more — which means more revenue for these companies.",
  },
  "black-dollar": {
    definition:
      "The Black dollar refers to the collective purchasing power of Black Americans, estimated at over $1.6 trillion annually. Research shows that a dollar spent in the Black community circulates there much less than a dollar spent in other communities. When Black consumers intentionally support Black-owned businesses, that spending stays in the community longer and creates more jobs and wealth.",
    realWorldExample:
      "When a movement pushes people to buy Black, companies like VAULT, CROWN, BLOC, and VIZN all see sales jump simultaneously. That coordinated spending creates jobs, funds expansion, and attracts investor attention. A sustained Black dollar movement could permanently shift which companies dominate their sectors — that's community economics in action.",
  },
};
