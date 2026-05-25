import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Activity, AlertTriangle, ArrowUpRight, CalendarDays, CheckCircle2,
    CircleDollarSign, ClipboardList, Download, FileText, MapPin,
    Package, PieChart as PieChartIcon, ShoppingBag, TrendingDown,
    TrendingUp, WalletCards, XCircle, Zap
} from 'lucide-react';
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import gsap from 'gsap';

const money = (value) => `${Number(value || 0).toLocaleString()} DH`;

const STATUS_LABELS = {
    EN_ATTENTE: 'En Attente',
    EN_COURS: 'En Cours',
    EXPEDIE: 'Expedie',
    LIVRE: 'Livre',
    ANNULE: 'Annule',
};

const STATUS_COLORS = {
    EN_ATTENTE: '#94a3b8',
    EN_COURS: '#f59e0b',
    EXPEDIE: '#3b82f6',
    LIVRE: '#10b981',
    ANNULE: '#ef4444',
};

const PERIODS = [
    { id: 'today', label: "Aujourd'hui", short: 'Jour', days: 1, bucket: 'day' },
    { id: 'week', label: 'Cette semaine', short: '7 jours', days: 7, bucket: 'day' },
    { id: 'month', label: 'Ce mois', short: '30 jours', days: 30, bucket: 'day' },
    { id: 'year', label: 'Cette annee', short: '12 mois', days: 365, bucket: 'month' },
];

const STOCK_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316'];

const normalizeStatusKey = (status) => String(status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]+/g, '_')
    .replace(/^_+|_+$/g, '');

const isDelivered = (order) => {
    const status = normalizeStatusKey(order.status || order.backendStatus);
    const payment = normalizeStatusKey(order.paymentStatus);
    return status === 'LIVRE' || payment === 'PAID';
};

const isCanceled = (order) => normalizeStatusKey(order.status || order.backendStatus) === 'ANNULE';

const orderAmount = (order) => Number(order.finalTotal || order.amount || 0);

const startOfDay = (date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

const addDays = (date, days) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
};

const addMonths = (date, months) => {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() + months);
    return copy;
};

const parseOrderDate = (order) => {
    const candidates = [order.createdAt, order.deliveredAt, order.shippedAt, order.updatedAt, order.date];
    for (const value of candidates) {
        if (!value) continue;
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
};

const formatAxisDay = (date) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date);
const formatAxisMonth = (date) => new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(date);

const rangeForPeriod = (period, offset = 0, now = new Date()) => {
    if (period.bucket === 'month') {
        const start = new Date(now.getFullYear() - offset, 0, 1);
        const end = new Date(now.getFullYear() - offset + 1, 0, 1);
        return { start, end };
    }

    const end = addDays(startOfDay(now), 1 - (period.days * offset));
    const start = addDays(end, -period.days);
    return { start, end };
};

const inRange = (date, range) => date >= range.start && date < range.end;

const percentChange = (current, previous) => {
    if (!previous && !current) return '0%';
    if (!previous) return '+100%';
    const value = ((current - previous) / previous) * 100;
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

const buildSeries = (orders, period, range) => {
    const buckets = [];

    if (period.bucket === 'month') {
        for (let index = 0; index < 12; index += 1) {
            const date = addMonths(range.start, index);
            buckets.push({
                key: `${date.getFullYear()}-${date.getMonth()}`,
                label: formatAxisMonth(date),
                revenue: 0,
                orders: 0,
            });
        }
    } else {
        for (let index = 0; index < period.days; index += 1) {
            const date = addDays(range.start, index);
            buckets.push({
                key: date.toISOString().slice(0, 10),
                label: period.days === 1 ? 'Aujourd hui' : formatAxisDay(date),
                revenue: 0,
                orders: 0,
            });
        }
    }

    orders.forEach((order) => {
        const date = parseOrderDate(order);
        if (!inRange(date, range)) return;
        const key = period.bucket === 'month'
            ? `${date.getFullYear()}-${date.getMonth()}`
            : startOfDay(date).toISOString().slice(0, 10);
        const bucket = buckets.find(item => item.key === key);
        if (!bucket) return;
        bucket.orders += 1;
        if (isDelivered(order)) bucket.revenue += orderAmount(order);
    });

    return buckets;
};

const aggregatePeriod = (orders, period) => {
    const range = rangeForPeriod(period);
    const previousRange = rangeForPeriod(period, 1);
    const currentOrders = orders.filter(order => inRange(parseOrderDate(order), range));
    const previousOrders = orders.filter(order => inRange(parseOrderDate(order), previousRange));

    const revenue = currentOrders.filter(isDelivered).reduce((sum, order) => sum + orderAmount(order), 0);
    const previousRevenue = previousOrders.filter(isDelivered).reduce((sum, order) => sum + orderAmount(order), 0);
    const delivered = currentOrders.filter(isDelivered).length;
    const canceled = currentOrders.filter(isCanceled).length;

    return {
        range,
        orders: currentOrders,
        revenue,
        previousRevenue,
        delivered,
        canceled,
        averageBasket: delivered ? revenue / delivered : 0,
        revenueTrend: percentChange(revenue, previousRevenue),
        countTrend: percentChange(currentOrders.length, previousOrders.length),
    };
};

const summarizeStatuses = (orders) => Object.keys(STATUS_LABELS).map((key) => ({
    key,
    name: STATUS_LABELS[key],
    value: orders.filter(order => normalizeStatusKey(order.status || order.backendStatus) === key).length,
    color: STATUS_COLORS[key],
}));

const summarizeProducts = (orders) => {
    const rows = new Map();

    orders.filter(isDelivered).forEach((order) => {
        (order.items || []).forEach((item) => {
            const key = item.productId || item.id || item.title || item.name || item.productTitle;
            const existing = rows.get(key) || {
                id: key,
                title: item.title || item.name || item.productTitle || 'Produit',
                image: item.image || item.productImage,
                quantity: 0,
                revenue: 0,
            };
            const quantity = Number(item.quantity || 1);
            const price = Number(item.price || item.unitPrice || 0);
            existing.quantity += quantity;
            existing.revenue += quantity * price;
            rows.set(key, existing);
        });
    });

    return [...rows.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
};

const summarizeCities = (orders) => {
    const rows = new Map();

    orders.filter(isDelivered).forEach((order) => {
        const city = order.city || order.shippingCity || 'Non precisee';
        const existing = rows.get(city) || { city, revenue: 0, orders: 0 };
        existing.revenue += orderAmount(order);
        existing.orders += 1;
        rows.set(city, existing);
    });

    return [...rows.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
};

const exportCsv = (filename, rows) => {
    const headers = Object.keys(rows[0] || { label: '', value: '' });
    const csv = [
        headers.join(','),
        ...rows.map(row => headers.map(header => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};

const TooltipBox = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const source = payload[0]?.payload || {};
    const data = payload.reduce((acc, item) => ({ ...acc, [item.dataKey]: item.value }), {});
    return (
        <div style={{
            background: '#0f172a',
            border: '1px solid rgba(148,163,184,0.24)',
            borderRadius: 10,
            padding: '10px 12px',
            boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
        }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#e2e8f0', marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700 }}>Revenue: {money(data.revenue)}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Commandes: {data.orders ?? source.orders ?? 0}</div>
        </div>
    );
};

const MetricCard = ({ icon: Icon, label, value, sub, color, trend }) => {
    const isUp = !String(trend || '').startsWith('-');
    const TrendIcon = isUp ? TrendingUp : TrendingDown;
    const trendColor = isUp ? '#10b981' : '#ef4444';

    return (
        <div className="tz-stat-card" style={{
            minHeight: 154,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.98))',
            border: '1px solid rgba(148,163,184,0.16)',
            borderRadius: 18,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', inset: 'auto -40px -50px auto', width: 130, height: 130, borderRadius: '50%', background: color, opacity: 0.12, filter: 'blur(35px)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={19} color={color} />
                </div>
                {trend && (
                    <div style={{ height: 28, display: 'flex', alignItems: 'center', gap: 5, padding: '0 9px', borderRadius: 999, color: trendColor, background: `${trendColor}14`, border: `1px solid ${trendColor}26`, fontSize: 10, fontWeight: 900 }}>
                        <TrendIcon size={12} />
                        {trend}
                    </div>
                )}
            </div>
            <div style={{ position: 'relative', zIndex: 1, marginTop: 24 }}>
                <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 950, lineHeight: 1, color: '#f8fafc', letterSpacing: -0.5 }}>{value}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: '#64748b', fontWeight: 700 }}>{sub}</div>
            </div>
        </div>
    );
};

const Section = ({ title, subtitle, icon: Icon, children, action }) => (
    <section className="tz-section" style={{
        background: 'rgba(255,255,255,0.022)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 18,
        minWidth: 0,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="#60a5fa" />
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{title}</div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginTop: 2 }}>{subtitle}</div>
                </div>
            </div>
            {action}
        </div>
        {children}
    </section>
);

const AdminStats = ({ stats = [], breakdown = {}, orders = [], products = [] }) => {
    const containerRef = useRef(null);
    const [periodId, setPeriodId] = useState('month');
    const period = PERIODS.find(item => item.id === periodId) || PERIODS[2];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.tz-stat-card', { y: 18, opacity: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out', clearProps: 'opacity,transform' });
            gsap.from('.tz-section', { y: 14, opacity: 0, duration: 0.45, stagger: 0.05, delay: 0.12, ease: 'power3.out', clearProps: 'opacity,transform' });
        }, containerRef);
        return () => ctx.revert();
    }, [periodId]);

    const analytics = useMemo(() => {
        const byPeriod = PERIODS.reduce((acc, item) => ({ ...acc, [item.id]: aggregatePeriod(orders, item) }), {});
        const selected = byPeriod[period.id];
        const series = buildSeries(orders, period, selected.range);
        const statusRows = summarizeStatuses(selected.orders);
        const productRows = summarizeProducts(selected.orders);
        const cityRows = summarizeCities(selected.orders);
        const canceledLoss = selected.orders.filter(isCanceled).reduce((sum, order) => sum + orderAmount(order), 0);
        const revenueTotal = orders.filter(isDelivered).reduce((sum, order) => sum + orderAmount(order), 0);
        const deliveredTotal = orders.filter(isDelivered).length;

        return {
            byPeriod,
            selected,
            series,
            statusRows,
            productRows,
            cityRows,
            canceledLoss,
            revenueTotal,
            deliveredTotal,
        };
    }, [orders, period]);

    const totalStock = breakdown.totalStock || products.reduce((sum, product) => sum + Number(product.stock || 0), 0) || 1;
    const categoryRows = breakdown.categoryBreakdown || [];
    const lowStockProducts = breakdown.lowStockProducts || [];
    const fallbackTopProducts = breakdown.topSellers || [];
    const displayedTopProducts = analytics.productRows.length ? analytics.productRows : fallbackTopProducts.map(product => ({
        id: product.id,
        title: product.title,
        image: product.image,
        quantity: product.reviews || 0,
        revenue: Number(product.price || 0),
    }));

    const periodCards = [
        { period: PERIODS[0], icon: CircleDollarSign, color: '#10b981' },
        { period: PERIODS[1], icon: CalendarDays, color: '#3b82f6' },
        { period: PERIODS[2], icon: WalletCards, color: '#f59e0b' },
        { period: PERIODS[3], icon: Activity, color: '#8b5cf6' },
    ].map(item => {
        const data = analytics.byPeriod[item.period.id];
        return {
            ...item,
            value: money(data.revenue),
            sub: `${data.delivered} livrees / ${data.orders.length} commandes`,
            trend: data.revenueTrend,
        };
    });

    const handleExportCsv = () => {
        exportCsv(`rapport-${period.id}.csv`, analytics.series.map(row => ({
            periode: row.label,
            revenue: row.revenue,
            commandes: row.orders,
        })));
    };

    const handleExportPdf = () => {
        const reportHtml = `
            <html>
                <head>
                    <title>Rapport ${period.label}</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #0f172a; padding: 28px; }
                        h1 { margin: 0 0 6px; font-size: 24px; }
                        p { margin: 0 0 18px; color: #64748b; }
                        table { width: 100%; border-collapse: collapse; margin-top: 18px; }
                        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
                        th { background: #f8fafc; text-transform: uppercase; letter-spacing: .08em; font-size: 10px; }
                        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
                        .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
                        .label { color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: .1em; }
                        .value { font-size: 18px; font-weight: 800; margin-top: 6px; }
                    </style>
                </head>
                <body>
                    <h1>Rapport admin - ${period.label}</h1>
                    <p>Genere le ${new Date().toLocaleString('fr-FR')}</p>
                    <section class="grid">
                        <div class="card"><div class="label">Revenue</div><div class="value">${money(analytics.selected.revenue)}</div></div>
                        <div class="card"><div class="label">Commandes</div><div class="value">${analytics.selected.orders.length}</div></div>
                        <div class="card"><div class="label">Panier moyen</div><div class="value">${money(analytics.selected.averageBasket)}</div></div>
                        <div class="card"><div class="label">Annulations</div><div class="value">${money(analytics.canceledLoss)}</div></div>
                    </section>
                    <table>
                        <thead><tr><th>Periode</th><th>Revenue</th><th>Commandes</th></tr></thead>
                        <tbody>${analytics.series.map(row => `<tr><td>${row.label}</td><td>${money(row.revenue)}</td><td>${row.orders}</td></tr>`).join('')}</tbody>
                    </table>
                </body>
            </html>
        `;
        const reportWindow = window.open('', '_blank', 'width=1000,height=900');
        if (!reportWindow) return;
        reportWindow.document.open();
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
        window.setTimeout(() => {
            reportWindow.focus();
            reportWindow.print();
        }, 250);
    };

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="tz-dashboard-hero" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 18,
                padding: 20,
                borderRadius: 18,
                background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.98))',
                border: '1px solid rgba(148,163,184,0.16)',
            }}>
                <div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>Analytics commercial</div>
                    <h2 style={{ margin: 0, color: '#f8fafc', fontSize: 24, fontWeight: 950, letterSpacing: -0.4 }}>Performance des ventes</h2>
                    <div style={{ marginTop: 8, color: '#64748b', fontSize: 12, fontWeight: 700 }}>
                        Revenue base sur les commandes livrees ou payees.
                    </div>
                </div>
                <div className="tz-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={handleExportCsv} className="tz-export-btn" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        height: 38, padding: '0 13px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#cbd5e1', fontSize: 11, fontWeight: 900, cursor: 'pointer',
                    }}>
                        <Download size={14} /> CSV
                    </button>
                    <button type="button" onClick={handleExportPdf} className="tz-export-btn" style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        height: 38, padding: '0 13px', borderRadius: 10,
                        background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.22)',
                        color: '#93c5fd', fontSize: 11, fontWeight: 900, cursor: 'pointer',
                    }}>
                        <FileText size={14} /> PDF
                    </button>
                </div>
            </div>

            <div className="tz-period-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                {periodCards.map(({ period: item, icon, color, value, sub, trend }) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setPeriodId(item.id)}
                        className="tz-period-card"
                        style={{
                            textAlign: 'left',
                            cursor: 'pointer',
                            border: `1px solid ${periodId === item.id ? `${color}55` : 'rgba(148,163,184,0.16)'}`,
                            background: periodId === item.id ? `${color}12` : 'rgba(255,255,255,0.022)',
                            borderRadius: 16,
                            padding: 0,
                        }}
                    >
                        <MetricCard icon={icon} label={item.label} value={value} sub={sub} color={color} trend={trend} />
                    </button>
                ))}
            </div>

            <div className="tz-metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                <MetricCard icon={ShoppingBag} label="Commandes" value={analytics.selected.orders.length} sub={`${analytics.selected.delivered} livrees`} color="#3b82f6" trend={analytics.selected.countTrend} />
                <MetricCard icon={CheckCircle2} label="Panier moyen" value={money(analytics.selected.averageBasket)} sub="Sur commandes livrees" color="#10b981" />
                <MetricCard icon={XCircle} label="Annulations" value={analytics.selected.canceled} sub={`${money(analytics.canceledLoss)} de pertes`} color="#ef4444" />
                <MetricCard icon={ClipboardList} label="Revenue total" value={money(analytics.revenueTotal)} sub={`${analytics.deliveredTotal} commandes livrees`} color="#8b5cf6" />
            </div>

            <div className="tz-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.8fr)', gap: 14 }}>
                <Section title="Courbe revenue" subtitle={period.label} icon={TrendingUp}>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics.series} margin={{ left: -18, right: 12, top: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.32} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                                <Tooltip content={<TooltipBox />} />
                                <Area type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={3} fill="url(#revenueGradient)" />
                                <Bar dataKey="orders" fill="#10b981" opacity={0.22} radius={[6, 6, 0, 0]} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Section>

                <Section title="Statuts commandes" subtitle="Repartition du flux" icon={PieChartIcon}>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={analytics.statusRows.filter(row => row.value > 0)} dataKey="value" nameKey="name" innerRadius={64} outerRadius={100} paddingAngle={4}>
                                    {analytics.statusRows.map(row => <Cell key={row.key} fill={row.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, color: '#e2e8f0' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {analytics.statusRows.map(row => (
                            <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 9, background: 'rgba(255,255,255,0.03)' }}>
                                <span style={{ width: 7, height: 7, borderRadius: 999, background: row.color, flexShrink: 0 }} />
                                <span style={{ color: '#cbd5e1', fontSize: 11, fontWeight: 800, flex: 1 }}>{row.name}</span>
                                <span style={{ color: row.color, fontSize: 11, fontWeight: 950 }}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            <div className="tz-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 14 }}>
                <Section title="Top produits" subtitle="Par revenue livre" icon={Package}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {displayedTopProducts.length ? displayedTopProducts.map((product, index) => (
                            <div key={product.id || product.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: 24, height: 24, borderRadius: 8, background: index === 0 ? 'rgba(245,158,11,0.18)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 0 ? '#f59e0b' : '#94a3b8', fontSize: 11, fontWeight: 950 }}>{index + 1}</div>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                    {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={17} color="#475569" />}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 850, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</div>
                                    <div style={{ color: '#64748b', fontSize: 10, fontWeight: 800, marginTop: 3 }}>{product.quantity || 0} unites vendues</div>
                                </div>
                                <div style={{ color: '#60a5fa', fontSize: 12, fontWeight: 950, whiteSpace: 'nowrap' }}>{money(product.revenue)}</div>
                            </div>
                        )) : (
                            <div className="tz-empty">Aucune vente livree pour cette periode</div>
                        )}
                    </div>
                </Section>

                <Section title="Top villes" subtitle="Revenue par ville" icon={MapPin}>
                    <div style={{ height: 230 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.cityRows} layout="vertical" margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                                <CartesianGrid stroke="rgba(148,163,184,0.08)" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="city" width={92} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<TooltipBox />} />
                                <Bar dataKey="revenue" radius={[0, 8, 8, 0]} fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {!analytics.cityRows.length && <div className="tz-empty">Aucune ville disponible pour cette periode</div>}
                </Section>
            </div>

            <div className="tz-main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)', gap: 14 }}>
                <Section title="Repartition du stock" subtitle="Inventaire par categorie" icon={Package}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {categoryRows.map((cat, index) => {
                            const percent = Math.round((Number(cat.stock || 0) / totalStock) * 100);
                            const color = STOCK_COLORS[index % STOCK_COLORS.length];
                            return (
                                <div key={cat.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: 999, background: color, flexShrink: 0 }} />
                                            <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</span>
                                        </div>
                                        <span style={{ color, fontSize: 12, fontWeight: 950 }}>{percent}%</span>
                                    </div>
                                    <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: 999 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Alertes stock" subtitle="Produits presque en rupture" icon={AlertTriangle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {lowStockProducts.length ? lowStockProducts.map(product => {
                            const critical = Number(product.stock || 0) <= 2;
                            return (
                                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, background: critical ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${critical ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.05)'}` }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {product.image ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Package size={17} color="#475569" />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 850, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</div>
                                        <div style={{ color: '#64748b', fontSize: 10, fontWeight: 800, marginTop: 3 }}>Stock restant</div>
                                    </div>
                                    <div style={{ color: critical ? '#ef4444' : '#f59e0b', fontSize: 18, fontWeight: 950 }}>{product.stock}</div>
                                </div>
                            );
                        }) : (
                            <div className="tz-empty">
                                <Zap size={18} />
                                Stock optimal
                            </div>
                        )}
                    </div>
                </Section>
            </div>

            <style>{`
                .tz-stat-card, .tz-section { opacity: 1; }
                .tz-period-card .tz-stat-card { border: 0 !important; background: transparent !important; }
                .tz-period-card:hover, .tz-export-btn:hover { filter: brightness(1.12); }
                .tz-empty {
                    min-height: 110px;
                    border: 1px dashed rgba(148,163,184,0.18);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #64748b;
                    font-size: 12px;
                    font-weight: 800;
                }
                @media (max-width: 1180px) {
                    .tz-period-grid, .tz-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                    .tz-main-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 640px) {
                    .tz-dashboard-hero { align-items: stretch !important; flex-direction: column !important; }
                    .tz-actions { justify-content: stretch !important; }
                    .tz-actions button { flex: 1; justify-content: center; }
                    .tz-period-grid, .tz-metric-grid { grid-template-columns: 1fr !important; }
                    .tz-stat-card { min-height: 138px !important; }
                }
            `}</style>
        </div>
    );
};

export default AdminStats;
