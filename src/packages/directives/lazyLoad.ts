import { DirectiveBinding } from 'vue';

const ob = new IntersectionObserver(
  (changes) => {
    for (const item of changes) {
      if (item.isIntersecting) {
        const lazyImg: any = item.target as HTMLImageElement;
        if (lazyImg && lazyImg.dataset) {
          lazyImg.src = lazyImg.dataset.src;
          lazyImg.dispatchEvent(new Event('startLoad'));
          ob.unobserve(lazyImg);
        }
      }
    }
  },
  {
    threshold: [0],
  }
);

export default {
  mounted(lazyImg: HTMLImageElement, binding: DirectiveBinding) {
    if (!binding.value) {
      return;
    }
    const { src, active: lazyActive } = binding.value;
    if (lazyActive) {
      lazyImg.dataset.src = src;
      ob.observe(lazyImg);
    } else {
      if (lazyImg) {
        lazyImg.src = src;
        lazyImg.dispatchEvent(new Event('startLoad'));
      }
    }
  },
};
