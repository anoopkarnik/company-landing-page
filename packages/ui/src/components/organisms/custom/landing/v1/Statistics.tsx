import { StatisticsProps } from "@repo/ts-types/landing-page/about";



export const Statistics = ({users, subscribers, products, downloads}:StatisticsProps) => {
   
    return (
      <section id="statistics">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold ">Users</h2>
              <p className="text-xl text-muted-foreground">{users}</p>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold ">Subscribers</h2>
              <p className="text-xl text-muted-foreground">{subscribers}</p>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold ">Downloads</h2>
              <p className="text-xl text-muted-foreground">{downloads}</p>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold ">Products</h2>
              <p className="text-xl text-muted-foreground">{products}</p>
            </div>
        </div>
      </section>
    );
  };