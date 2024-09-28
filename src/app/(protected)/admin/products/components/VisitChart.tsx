import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
    {
      name: '01 Aug',
      uv: 0,
    //   pv: 0,
    },
    {
      name: '24 Aug',
      uv: 10,
    //   pv: 12,
    },
];

export const colors = ['#16B364', '#EAAA08', '#D42E2F'];

const VisitChart = () => {
  const formatYAxisTick = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `#${tickItem.toLocaleString()}`;
    }
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
            <BarChart
              width={500}
              height={350}
              data={data}
              margin={{
              top: 5,
              right: 0,
              left: -30,
              bottom: 5,
              }}
            >
                <XAxis fontSize={"14px"} tickLine={false} axisLine={false} dataKey={"name"}/>
                <YAxis fontSize={"14px"} tickLine={false} axisLine={false} tickFormatter={formatYAxisTick}/>
                <CartesianGrid strokeOpacity={0.5} strokeDasharray="12 10" color='#F2F4F7' vertical={false}/>
                <Bar barSize={50} dataKey={"uv"} fill='#1570EF'>
                {/* {data?.map((entry, index) => (
                    <Cell key={`cell-${index}`} name={entry.name} fill={colors[index % colors.length]} />
                ))} */}
                </Bar>   
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default VisitChart