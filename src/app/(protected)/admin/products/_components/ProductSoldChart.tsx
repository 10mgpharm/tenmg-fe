
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: '01',
    uv: 2,
  },
  {
    name: '04',
    uv: 55,
  },
  {
    name: '08',
    uv: 32,
  },
  {
    name: '12',
    uv: 102,

  },
  {
    name: '16',
    uv: 75,
  },
  {
    name: '20',
    uv: 112,
  },
  {
    name: '24',
    uv: 98,
  },
];

const ProductSoldChart = () => {

  const formatYAxisTick = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `#${tickItem.toLocaleString()}`;
    }
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -25,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
          <XAxis tickLine={false} axisLine={false} fontSize={"14px"} dataKey="name" />
          <YAxis tickLine={false} axisLine={false} fontSize={"14px"} tickFormatter={formatYAxisTick}/>
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#FDB022" strokeWidth={"2px"} fill="#FFF7ED" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProductSoldChart;