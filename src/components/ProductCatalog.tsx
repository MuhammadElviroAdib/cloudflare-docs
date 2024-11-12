import { useState, type ChangeEvent } from "react";
import { getIconData, iconToSVG } from "@iconify/utils";
// @ts-ignore virtual module
import iconCollection from "virtual:astro-icon";
import { type CollectionEntry } from "astro:content";

const ProductCatalog = ({
	products,
}: {
	products: CollectionEntry<"products">[];
}) => {
	const [filters, setFilters] = useState<{
		search: string;
		groups: string[];
	}>({
		search: "",
		groups: [],
	});

	const groups = [...new Set(products.map((product) => product.groups).flat())];

	const productList = products.filter((product) => {
		if (filters.groups.length > 0) {
			if (
				filters.groups.filter((val) => product.groups.includes(val)).length ===
				0
			) {
				return false;
			}
		}

		if (filters.search) {
			if (
				!product.data.name.toLowerCase().includes(filters.search.toLowerCase())
			) {
				return false;
			}
		}

		return true;
	});

	return (
		<div className="md:flex">
			<div className="md:w-1/4 w-full mr-8">
				<input
					type="text"
					className="w-full mb-8 rounded-md bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 px-2 py-2"
					placeholder="Search products"
					value={filters.search}
					onChange={(e) => setFilters({ ...filters, search: e.target.value })}
				/>

				<div className="!mb-8 md:block hidden">
					<span className="uppercase text-gray-600 dark:text-gray-200 text-sm font-bold">
						Groups
					</span>

					{groups.map((group) => (
						<label key={group} className="block !my-2">
							<input
								type="checkbox"
								className="mr-2"
								value={group}
								onChange={(e: ChangeEvent<HTMLInputElement>) => {
									if (e.target.checked) {
										setFilters({
											...filters,
											groups: [...filters.groups, e.target.value],
										});
									} else {
										setFilters({
											...filters,
											groups: filters.groups.filter(
												(f) => f !== e.target.value,
											),
										});
									}
								}}
							/>{" "}
							{group}
						</label>
					))}
				</div>
			</div>

			<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 lg:gap-4 lg:w-3/4 w-full items-stretch self-start !mt-0">
				{productList.length === 0 && (
					<div className="border lg:col-span-3 md:col-span-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-500 rounded-md w-full flex-col flex align-middle justify-center text-center py-6">
						<span className="text-lg !font-bold">No products found</span>
						<p>
							Try a different search term, or broaden your search by removing
							filters.
						</p>
					</div>
				)}
				{productList.map((product, idx) => {
					const iconData = getIconData(iconCollection.local, product.id);
					let icon = null;
					if (iconData) {
						icon = iconToSVG(iconData);
					}
					return (
						<a
							href={product.data.product.url}
							className="self-stretch p-3 border-gray-200 dark:border-gray-700 border-solid border rounded-md block !text-inherit no-underline hover:bg-gray-50 dark:hover:bg-black"
						>
							<div className="flex items-center">
								{icon && (
									<div className="rounded-full p-2 bg-orange-50 mr-2 text-orange-500">
										<svg
											{...icon.attributes}
											width={28}
											height={28}
											dangerouslySetInnerHTML={{ __html: icon.body }}
										/>
									</div>
								)}
								{!icon && (
									<div className="flex items-center justify-center leading-none rounded-full p-2 bg-orange-50 mr-2 text-[color:var(--orange-accent-200)] text-xl font-bold w-11 h-11">
										{product.data.name.substr(0, 1)}
									</div>
								)}
								<span className="font-semibold text-lg text-ellipsis overflow-hidden whitespace-nowrap">
									{product.data.name}
								</span>
							</div>
							{product.data.meta && (
								<p className="!mt-2 line-clamp-2 text-sm leading-6">
									{product.data.meta.description}
								</p>
							)}
						</a>
					);
				})}
			</div>
		</div>
	);
};

export default ProductCatalog;
