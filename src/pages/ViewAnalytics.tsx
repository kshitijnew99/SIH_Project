import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, Pie, Line, Cell, Area } from "recharts";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  LineChart,
  AreaChart,
} from "recharts";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, User } from "lucide-react";

const COLORS = ['#0ea5e9', '#22d3ee', '#0ea5e9', '#38bdf8'];
const CHART_COLORS = {
  primary: '#0ea5e9',
  secondary: '#22d3ee',
  tertiary: '#38bdf8',
  background: '#f8fafc',
  text: '#475569'
};

// Generate last 6 months of data
const generateMonthlyData = () => {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 30000,
    rentedLands: Math.floor(Math.random() * 5) + 5,
  }));
};

// Generate weekly data
const generateWeeklyData = () => {
  return Array.from({ length: 4 }, (_, i) => ({
    week: `Week ${i + 1}`,
    inquiries: Math.floor(Math.random() * 20) + 10,
    conversions: Math.floor(Math.random() * 10) + 5,
  }));
};

const ViewAnalytics = () => {
  const [landListings, setLandListings] = useState<any[]>([]);
  const [monthlyData] = useState(generateMonthlyData());
  const [weeklyData] = useState(generateWeeklyData());

  useEffect(() => {
    // Get land listings from localStorage
    const getLandListings = () => {
      try {
        const listings = localStorage.getItem('landListings');
        if (listings) {
          return JSON.parse(listings);
        }
      } catch (error) {
        console.error('Error reading land listings:', error);
      }
      return [];
    };

    setLandListings(getLandListings());
  }, []);

  // Calculate analytics data
  const totalLands = landListings.length;
  const totalArea = landListings.reduce((sum, land) => sum + parseFloat(land.landSize || 0), 0);
  const averageFertility = landListings.reduce((sum, land) => sum + parseFloat(land.fertilityIndex || 0), 0) / totalLands || 0;

  // Prepare chart data
  const fertilityData = landListings.map(land => ({
    name: land.title,
    index: parseFloat(land.fertilityIndex || 0)
  }));

  const landDistributionData = [
    { 
      name: "Currently Rented", 
      value: landListings.filter(land => land.status === 'rented').length 
    },
    { 
      name: "Available", 
      value: landListings.filter(land => land.status === 'available').length 
    }
  ];

  // Calculate monthly earnings data
  const calculateMonthlyEarnings = () => {
    return landListings.reduce((total, land) => {
      if (land.status === 'rented') {
        return total + (parseFloat(land.rentalPrice) * parseFloat(land.landSize));
      }
      return total;
    }, 0);
  };

  const monthlyEarnings = calculateMonthlyEarnings();
  return (
    <div className="p-8 w-full">
      <div className="grid gap-6 max-w-[1800px] mx-auto">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lands</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLands}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total agricultural lands registered
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mb-16" />
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArea.toFixed(1)} acres</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total land area under management
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mb-16" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
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
              <div className="text-2xl font-bold">₹{monthlyEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total monthly rental income
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mb-16" />
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Fertility</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageFertility.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Average fertility index across lands
              </p>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mb-16" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Fertility Index Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-base font-medium">Fertility Index by Land</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Compare fertility indices across your agricultural lands
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                Last 30 days
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fertilityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="fertilityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="index" 
                      fill="url(#fertilityGradient)"
                      radius={[4, 4, 0, 0]}
                      name="Fertility Index"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Land Distribution Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-base font-medium">Land Distribution</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Current status of your land portfolio
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                Real-time
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={landDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {landDistributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {landDistributionData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-base font-medium">Revenue Trends</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Monthly revenue from land rentals
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                Last 6 months
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_COLORS.primary}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      dot={{ stroke: CHART_COLORS.primary, strokeWidth: 2, fill: '#fff', r: 4 }}
                      activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Performance */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
              <div>
                <CardTitle className="text-base font-medium">Weekly Performance</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Inquiries vs Successful Rentals
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                Current Month
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="week" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: CHART_COLORS.text, fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="inquiries" 
                      fill={CHART_COLORS.primary} 
                      radius={[4, 4, 0, 0]}
                      name="Total Inquiries"
                    />
                    <Bar 
                      dataKey="conversions" 
                      fill={CHART_COLORS.secondary}
                      radius={[4, 4, 0, 0]}
                      name="Successful Rentals"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Land Details List - Full Width */}
        <div className="col-span-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Land Details Overview</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Quick summary of all your lands
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {landListings.map((land, index) => (
                  <div key={land.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                    <div>
                      <h4 className="font-semibold">{land.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{land.landSize} Acres</span>
                      </div>
                    </div>
                    <Badge
                      variant={land.status === 'available' ? 'secondary' : 'default'}
                      className={land.status === 'available' ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'}
                    >
                      {land.status === 'available' ? 'Available' : 'Rented'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ViewAnalytics;