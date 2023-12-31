import { List, Card, Skeleton } from "antd";

import listingLoadingCardCover from "../../assets/listing-loading-card-cover.jpg";

export const ListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div className="home-listings-skeleton">
      <Skeleton paragraph={{ rows: 1 }} />
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 4,
            column: 4,
          }}
          dataSource={emptyData}
          renderItem={() => (
            <List.Item>
              <Card
                cover={
                  <div
                    className="home-listings-skeleton__card-cover-img"
                    style={{
                      backgroundImage: `url(${listingLoadingCardCover})`,
                    }}
                  ></div>
                }
                loading
              />
            </List.Item>
          )}
        />
    </div>
  );
};
