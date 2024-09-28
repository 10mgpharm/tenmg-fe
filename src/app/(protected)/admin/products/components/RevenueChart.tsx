
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    {
      name: '01',
      uv: 2300,
    },
    {
      name: '04',
      uv: 55000,
    },
    {
      name: '08',
      uv: 87000,
    },
    {
      name: '12',
      uv: 67000,
  
    },
    {
      name: '16',
      uv: 45000,
    },
    {
      name: '20',
      uv: 120000,
    },
    {
      name: '24',
      uv: 180000,
    },
  ];

const RevenueChart = () => {

  const formatYAxisTick = (tickItem: any) => {
    if (tickItem >= 10000) {
        const value = tickItem / 1000;
      return `#${value}k`;
    }
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 5,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false} />
          <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
          <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#6938EF" strokeWidth={2} fill="#faf5ff" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart;