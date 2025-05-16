"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function DashboardPage() {
    // Mock data for stamp claims
    const visitorStats = {
        totalClaims: 438,
        totalUniqueClaims: 392,
        lastWeekClaims: 57,
        conversionRate: "87%",
    };

    // Mock data for demographics
    const ageData = [
        { name: "18-24", value: 122 },
        { name: "25-34", value: 164 },
        { name: "35-44", value: 85 },
        { name: "45-54", value: 41 },
        { name: "55+", value: 26 },
    ];

    const genderData = [
        { name: "Male", value: 219 },
        { name: "Female", value: 204 },
        { name: "Other", value: 15 },
    ];

    const countryData = [
        { name: "United States", value: 98 },
        { name: "Japan", value: 72 },
        { name: "Germany", value: 57 },
        { name: "United Kingdom", value: 54 },
        { name: "Australia", value: 43 },
        { name: "Canada", value: 37 },
        { name: "Other", value: 77 },
    ];

    const monthlyData = [
        { name: "Jan", claims: 14 },
        { name: "Feb", claims: 22 },
        { name: "Mar", claims: 41 },
        { name: "Apr", claims: 63 },
        { name: "May", claims: 298 },
    ];

    // Colors for charts
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884d8",
        "#82ca9d",
        "#ffc658",
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center">
                <h1 className="text-xl font-semibold">Stamply Dashboard</h1>
                <span className="ml-2 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    CN Tower Landmark
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleString()}
                    </span>
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Stamp Claims
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {visitorStats.totalClaims}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +{visitorStats.lastWeekClaims} from last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Unique Visitors
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {visitorStats.totalUniqueClaims}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {visitorStats.conversionRate} conversion rate
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avg. Claims Per Day
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3.5</div>
                            <p className="text-xs text-muted-foreground">
                                +2.1 from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Most Active Time
                            </CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="5"
                                    rx="2"
                                />
                                <path d="M2 10h20" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2-4 PM</div>
                            <p className="text-xs text-muted-foreground">
                                Weekends see 43% more activity
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="demographics">
                            Demographics
                        </TabsTrigger>
                        <TabsTrigger value="countries">Countries</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Claims</CardTitle>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="claims"
                                                fill="#8884d8"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="demographics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Age Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={ageData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        `${name}: ${(
                                                            percent * 100
                                                        ).toFixed(0)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {ageData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gender Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={genderData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        `${name}: ${(
                                                            percent * 100
                                                        ).toFixed(0)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {genderData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="countries" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Country of Origin</CardTitle>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            layout="vertical"
                                            data={countryData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 60,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                dataKey="value"
                                                fill="#82ca9d"
                                                name="Visitors"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Visitors
                    </h2>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Wallet Address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Country
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Age
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Gender
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Date Claimed
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        0x7e5f...8d31
                                    </td>
                                    <td className="px-6 py-4">Japan</td>
                                    <td className="px-6 py-4">27</td>
                                    <td className="px-6 py-4">Female</td>
                                    <td className="px-6 py-4">
                                        Today, 2:45 PM
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        0x3a2b...9c12
                                    </td>
                                    <td className="px-6 py-4">United States</td>
                                    <td className="px-6 py-4">34</td>
                                    <td className="px-6 py-4">Male</td>
                                    <td className="px-6 py-4">
                                        Today, 1:32 PM
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        0xf42d...5e78
                                    </td>
                                    <td className="px-6 py-4">Germany</td>
                                    <td className="px-6 py-4">42</td>
                                    <td className="px-6 py-4">Male</td>
                                    <td className="px-6 py-4">
                                        Today, 11:20 AM
                                    </td>
                                </tr>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        0x91ab...6f45
                                    </td>
                                    <td className="px-6 py-4">Australia</td>
                                    <td className="px-6 py-4">29</td>
                                    <td className="px-6 py-4">Female</td>
                                    <td className="px-6 py-4">
                                        Yesterday, 5:15 PM
                                    </td>
                                </tr>
                                <tr className="bg-white dark:bg-gray-800">
                                    <td className="px-6 py-4 font-mono text-xs">
                                        0x58cd...3b29
                                    </td>
                                    <td className="px-6 py-4">
                                        United Kingdom
                                    </td>
                                    <td className="px-6 py-4">51</td>
                                    <td className="px-6 py-4">Male</td>
                                    <td className="px-6 py-4">
                                        Yesterday, 3:48 PM
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
