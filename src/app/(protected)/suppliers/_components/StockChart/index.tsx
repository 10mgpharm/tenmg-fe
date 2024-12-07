import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
    {
      name: 'In Stock',
      uv: 76,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Low Stock',
      uv: 65,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Out of Stock',
      uv: 55,
      pv: 9800,
      amt: 2290,
    },
];

export const colors = ['#16B364', '#EAAA08', '#D42E2F'];

const StockChart = () => {
  const formatYAxisTick = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `${tickItem.toLocaleString()}`;
    }
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
            <BarChart
              width={500}
              height={400}
              data={data}
              margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 5,
              }}
            >
                <XAxis dataKey={"name"}/>
                <YAxis tickFormatter={formatYAxisTick}/>
                <Bar barSize={80} dataKey={"uv"} radius={[10, 10, 0, 0]}>
                {data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} name={entry.name} fill={colors[index % colors.length]} className='rounded-md' />
                ))}
                </Bar>   
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default StockChart