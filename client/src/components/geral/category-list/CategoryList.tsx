import { CategoryProps, Categorys } from "../../../lib/utils";
import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css"
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

const CategoryList = () => {
    return (
        <section className="category-list-wrapper">
            <div className="category-list-content">
                <Swiper
                    slidesPerView={6}
                    spaceBetween={10}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {Categorys.map((item: CategoryProps, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard title={item.title} redirect={item.redirect} key={id} photoURL={item.photoURL} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="category-list-content-mobile">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[]}
                    className="mySwiper"
                >
                    {Categorys.map((item, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard title={item.title} redirect={item.redirect} key={id} photoURL={item.photoURL} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default CategoryList;
