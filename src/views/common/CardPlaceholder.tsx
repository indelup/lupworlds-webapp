import classes from "./Card.module.scss";

export const CardPlaceholder = () => (
    <div className={classes.card}>
        <div className={classes.shimmer} />
    </div>
);
