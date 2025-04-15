import { useEffect, useState } from "react";
import { CategoryProps, Categorys } from "../../../lib/utils";
import CategoryCard from "../category-card/CategoryCard";
import "./CategoryList.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Facilitys } from "../../../services/facilitysService";

const CategoryList = () => {
    const [facilityImages, setFacilityImages] = useState<{ [key: string]: string }>({});

    const getFacilitys = async (photoURL: string) => {
        try {
            const facility = await Facilitys.get(photoURL);
            setFacilityImages((prev: any) => ({
                ...prev,
                [photoURL]: facility.data[0].data,
            }));

        } catch (error: any) {
            throw Error(error);
        }
    };

    useEffect(() => {
        Categorys.forEach((item) => {
            getFacilitys(item.photoURL);
        });
    }, []);

    return (
        <section className="category-list-wrapper">
            <div className="category-list-content">
                <Swiper
                    slidesPerView={6}
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {Categorys.map((item, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard
                                title={item.title}
                                redirect={item.redirect}
                                photoURL={facilityImages[item.photoURL] || item.photoURL} // Usa a nova imagem ou a original
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="category-list-content-mobile">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    modules={[]}
                    className="mySwiper"
                >
                    {Categorys.map((item, id) => (
                        <SwiperSlide key={id}>
                            <CategoryCard
                                title={item.title}
                                redirect={item.redirect}
                                photoURL={facilityImages[item.photoURL] || item.photoURL} // Mesmo aqui
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryList;
